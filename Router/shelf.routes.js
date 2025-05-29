const { Router } = require("express");
const {getUserShelfBooks, addToShell, deleteUserShelfBooks} = require("../Controller/shelf.controller")
const ShelfValidator = require("../Middlewares/shelf_validation_middleware")
const shelfRouter = Router();

shelfRouter.get("/get_user_books/:userId", getUserShelfBooks);
shelfRouter.post("/add_to_shelf", [ShelfValidator], addToShell);
shelfRouter.delete("/delete_from_shell/:id", deleteUserShelfBooks);

module.exports = shelfRouter;
