const UserModel = require("../Schemas/auth.schema")
const BaseError = require("../Utils/base_error");
const {verify} = require("jsonwebtoken");

const userInfo = async (req, res, next) => {
    try {
        const {refreshtoken} = req.cookies
        if (!refreshtoken) {
            const {refreshtoken} = req.headers
            if (!refreshtoken) {
                return next(BaseError.BadRequest(403, "Token not found!"))
            }
        }
        const token = refreshtoken
        const decoded = verify(token, process.env.REFRESH_SECRET_KEY)
        const email = decoded.email
        const foundUser = await UserModel.findOne({email})
        
        if (!foundUser) {
            return next(BaseError.BadRequest(403, "User not found!"))
        }
        res.status(200).json({username: foundUser.username, email: foundUser.email, imageUrl: foundUser.img})
    } catch (error) {
        next(error);
    }
}

module.exports = userInfo