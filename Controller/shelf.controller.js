const UserModel = require("../Schemas/auth.schema");
const BaseError = require("../Utils/base_error");
const BooksModel = require("../Schemas/books.schema");
const ShelfModel = require("../Schemas/shelf.schema");

async function addToShell(req, res, next) {
  try {
    const { bookId, userId } = req.body;
    const founduser = await UserModel.findOne({ _id: userId });
    const foundBook = await BooksModel.findOne({ _id: bookId });
    if (founduser) {
      if (foundBook) {
        await ShelfModel.create({ bookId, userId });
        return res.status(201).json({
          message: `${foundBook.title} kitobi ${founduser.username}ning kitob javoniga qo'shildi!`,
        });
      }
      return next(
        BaseError.BadRequest(
          404,
          `Kechirasiz ${founduser.username}, kutubxonamizda bunday kitob topilmadi...`
        )
      );
    }
    return next(
      BaseError.BadRequest(
        403,
        `Kechirasiz, izoh qoldirish uchun avval ro'yxatdan o'tishingiz lozim!`
      )
    );
  } catch (error) {
    next(error);
  }
}

async function getUserShelfBooks(req, res, next) {
  try {
    const foundBooks = await ShelfModel.find({userId: req.params.userId})
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
