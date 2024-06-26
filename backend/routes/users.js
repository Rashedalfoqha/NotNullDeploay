const express = require("express");
const {
  register,
  login,
  updateUserById,
  getUserById,
  getUserByToken
} = require("../controller/users");
const authentication = require("../middleware/authentication");

const usersRouter = express.Router();
usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.put("/update", authentication, updateUserById);
usersRouter.get("/:id", getUserById);
usersRouter.get("/", authentication, getUserByToken);

module.exports = usersRouter;
