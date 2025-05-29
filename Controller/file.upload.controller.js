const path = require("path");
const BooksModel = require("../Schemas/books.schema");
const AuthorsModel = require("../Schemas/authors.schema");
const BaseError = require("../Utils/base_error");
const supabase = require("../Utils/supabase");

const multer = require("multer");
const userModel = require("../Schemas/auth.schema");
const storage = multer.memoryStorage();
const upload = multer({ storage });

async function fileUploader(req, res, next) {
  upload.single("picture")(req, res, async (err) => {
    if (err) return next(err);
    if (!req.file) return next(BaseError.BadRequest(400, "Fayl topilmadi!"));

    const { originalname, buffer, mimetype } = req.file;
    const fileExt = path.extname(originalname);
    const fileName = `${Date.now()}${fileExt}`;

    // Faylni Supabase Storage'ga yuklash
    const { error } = await supabase
      .storage
      .from("images") // <-- storage bucket nomi
      .upload(fileName, buffer, {
        contentType: mimetype,
      });

    if (error) return next(BaseError.BadRequest(500, "Yuklashda xatolik: " + error.message));

    // Fayl URL
    const { data: publicUrl } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    const { modelType, id } = req.params;
    let model;

    if (modelType === "book") model = BooksModel;
    else if (modelType === "author") model = AuthorsModel;
    else if (modelType === "user") model = userModel;
    else return next(BaseError.BadRequest(400, "Noto‘g‘ri model turi!"));

    const updatedItem = await model.findByIdAndUpdate(id, { img: publicUrl.publicUrl }, { new: true });
    if (!updatedItem) return res.status(404).json({ message: "Ma'lumot topilmadi!" });

    res.status(201).json({
      message: "Rasm Supabase'ga yuklandi",
      image: publicUrl.publicUrl,
    });
  });
}

module.exports = fileUploader;
