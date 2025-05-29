const mongoose = require("mongoose");
const { Schema } = mongoose;

const shelfSchema = new Schema(
{
    userId: {
        type: Schema.ObjectId,
        ref: "auth",
        required: [true, "Foydalanuvchi ID'si kiritilishi lozim!"],
    },
    bookId: {
        type: Schema.ObjectId,
        ref: "books",
        required: [true, "Kitob ID'si kiritilishi lozim!"],
    }
},
  { versionKey: false }
);

const ShelfModel = mongoose.model("shelf", shelfSchema);
module.exports = ShelfModel;
