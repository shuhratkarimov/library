const Joi = require("joi");

const ShelfValidation = (data) => {
  try {
    const ShelfValidationSchema = Joi.object({
      userId: Joi.string().min(2).max(40).required().messages({
        "string.base": "User ID'si string ko'rinishida bo'lishi kerak!",
        "string.empty": "User ID'si bo'sh bo'lmasligi kerak!",
        "any.required": "User ID'si talab qilinadi va kiritilishi lozim!",
        "string.min":
          "User ID'si kamida 2 (ikki)ta belgidan iborat bo'lishi lozim!",
        "string.max":
          "User ID'si ko'pi bilan 40 (qirq)ta belgidan iborat bo'lishi mumkin!",
      }),
      bookId: Joi.string().min(2).max(40).required().messages({
        "string.base": "Book ID'si string ko'rinishida bo'lishi kerak!",
        "string.empty": "Book ID'si bo'sh bo'lmasligi kerak!",
        "any.required": "Book ID'si talab qilinadi va kiritilishi lozim!",
        "string.min":
          "Book ID'si kamida 2 (ikki)ta belgidan iborat bo'lishi lozim!",
        "string.max":
          "Book ID'si ko'pi bilan 40 (qirq)ta belgidan iborat bo'lishi mumkin!",
      }),
    });
    return ShelfValidationSchema.validate(data);
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = ShelfValidation;
