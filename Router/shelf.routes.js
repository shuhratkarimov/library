const { Router } = require("express");
const {getUserShelfBooks, addToShell, deleteUserShelfBooks} = require("../Controller/shelf.controller")
const ShelfValidator = require("../Middlewares/shelf_validation_middleware")
const shelfRouter = Router();

shelfRouter.get("/get_user_books", getUserShelfBooks);
shelfRouter.post("/add_to_shelf/:bookId", addToShell);
shelfRouter.delete("/delete_from_shell/:bookId", deleteUserShelfBooks);

module.exports = shelfRouter;
