// Import modules and files
const express = require("express");
const WishlistRouter = express.Router();
const WishlistController = require('../../controllers/WishlistController/WishlistController');

WishlistRouter.post("/create", WishlistController.addItem);
WishlistRouter.get("/display", WishlistController.getAllItems);
WishlistRouter.delete("/delete/:id", WishlistController.deleteItem);
WishlistRouter.get("/getcount/:id", WishlistController.getCount);

module.exports = WishlistRouter;
