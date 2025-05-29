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
  upload.single("file")(req, res, async (err) => {
    if (err) return next(err);
    if (!req.file) return next(BaseError.BadRequest(400, "Fayl topilmadi!"));

    const { originalname, buffer, mimetype } = req.file;
    const fileExt = path.extname(originalname);
    const fileName = `${Date.now()}${fileExt}`;

    // Fayl turi asosida Supabase bucket tanlash
    let bucket = "others";
    if (mimetype.startsWith("image/")) {
      bucket = "images";
    } else if (mimetype === "application/pdf") {
      bucket = "pdfs";
    } else if (mimetype.startsWith("audio/")) {
      bucket = "audios";
    }

    // Supabase'ga yuklash
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, { contentType: mimetype });

    if (error) {
      return next(BaseError.BadRequest(500, "Yuklashda xatolik: " + error.message));
    }

    // Faylga ochiq URL olish
    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    const { modelType, id } = req.params;
    let model;

    if (modelType === "book") model = BooksModel;
    else if (modelType === "author") model = AuthorsModel;
    else if (modelType === "user") model = userModel;
    else return next(BaseError.BadRequest(400, "Noto‘g‘ri model turi!"));

    // Qaysi maydonga yozamiz (img, pdfUrl, audioUrl)
    let updateField = "fileUrl";
    if (bucket === "images") updateField = "img";
    else if (bucket === "pdfs") updateField = "pdfUrl";
    else if (bucket === "audios") updateField = "audioUrl";
    
    // Yangilash
    const updatedItem = await model.findByIdAndUpdate(id, {
      [updateField]: publicUrl.publicUrl,
    }, { new: true });

    if (!updatedItem) return res.status(404).json({ message: "Ma'lumot topilmadi! Ehtimol user yoki book yoki author id larini berishda adashdingiz :(" });

    res.status(201).json({
      message: `Fayl (${bucket}) Supabase'ga yuklandi`,
      url: publicUrl.publicUrl,
      type: bucket,
    });
  });
}

module.exports = fileUploader;
