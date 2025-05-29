const UserModel = require("../Schemas/auth.schema")
const BaseError = require("../Utils/base_error");
const jwt = require("jsonwebtoken");

const userInfo = async (req, res, next) => {
    try {
        const {refreshtoken} = req.coookies
        if (!refreshtoken) {
            return next(BaseError.BadRequest(403, "Token not found!"))
        }
        const decoded = jwt.verify(token, process.env.REFRESH_SECRET_KEY)
        const foundUser = UserModel.findOne({email: decoded.email})
        if (!foundUser) {
            return next(BaseError.BadRequest(403, "User not found!"))
        }
        return res.status(200).json({username: foundUser.username, email: foundUser.email, imageUrl: foundUser.img})
    } catch (error) {
        next(error);
    }
}

module.exports = userInfo