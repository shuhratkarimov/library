const UserModel = require("../Schemas/auth.schema");
const BaseError = require("../Utils/base_error");
const BooksModel = require("../Schemas/books.schema");
const ShelfModel = require("../Schemas/shelf.schema");
const jwt = require("jsonwebtoken")

async function addToShell(req, res, next) {
  try {
    const {refreshtoken} = req.cookies
    
    if (!refreshtoken) {
        const {refreshtoken} = req.headers
        if (!refreshtoken) {
            return next(BaseError.BadRequest(403, "Token not found!"))
        }
    }
    const token = refreshtoken
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET_KEY)
    const email = decoded.email
    const foundUser = await UserModel.findOne({email})
    
    if (!foundUser) {
        return next(BaseError.BadRequest(403, "User not found!"))
    }
    
    const foundBook = await BooksModel.findById(req.params.bookId);
    if (foundUser) {
      if (foundBook) {
        await ShelfModel.create({ bookId:req.params.bookId, userId:foundUser._id });
        return res.status(201).json({
          message: `${foundBook.title} kitobi ${foundUser.username}ning kitob javoniga qo'shildi!`,
        });
      }
      return next(
        BaseError.BadRequest(
          404,
          `Kechirasiz ${foundUser.username}, kutubxonamizda bunday kitob topilmadi...`
        )
      );
    }
    return next(
      BaseError.BadRequest(
        403,
        `Kechirasiz, kitobni javonga qo'shish uchun avval ro'yxatdan o'tishingiz lozim!`
      )
    );
  } catch (error) {
    next(error);
  }
}

async function getUserShelfBooks(req, res, next) {
  try {
    const {refreshtoken} = req.cookies
    if (!refreshtoken) {
        const {refreshtoken} = req.headers
        if (!refreshtoken) {
            return next(BaseError.BadRequest(403, "Token not found!"))
        }
    }
    const token = refreshtoken
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET_KEY)
    const email = decoded.email
    const foundUser = await UserModel.findOne({email})
    
    if (!foundUser) {
        return next(BaseError.BadRequest(403, "User not found!"))
    }
    const foundBooks = await ShelfModel.find({userId: foundUser._id})
      .populate("userId", ["username"])
      .populate({path: "bookId", select: "title", populate: {path: "author", select: "full_name"}});
    if (!foundBooks) {
      return next(BaseError.BadRequest(403, "Hali kitoblar mavjud emas!"));
    }
    res.status(201).json(foundBooks);
  } catch (error) {
    next(error);
  }
}

async function deleteUserShelfBooks(req, res, next) {
  try {
    const foundBook = await ShelfModel.findById(req.params.id)
    if (!foundBook) {
      return next(BaseError.BadRequest(403, "Bunday kitob mavjud emas!"));
    }
    res.status(201).json({message: "Kitob o'chirildi"});
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addToShell,
  getUserShelfBooks,
  deleteUserShelfBooks
};
