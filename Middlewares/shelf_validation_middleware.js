const ShelfValidation = require("../Validator/shelf.validation");

module.exports = function ShelfValidator(req, res, next) {
  try {
    const { error } = ShelfValidation(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    return next();
  } catch (error) {
    throw new Error(error.message);
  }
};
