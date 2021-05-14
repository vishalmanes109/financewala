const express = require("express");

const router = express.Router();

const {
  createUser,
  getUsers,
  isUserNameAvailable,
  deleteUser,
  updateUser,
  login,
  getUserById,
} = require("./user.controller");

router.get("/username/:username", isUserNameAvailable);
router.get("/userid/:userid", getUserById);
router.post("/", createUser);
router.get("/all", getUsers);
router.post("/login", login);
router.delete("/:id", deleteUser);
router.patch("/", updateUser);

module.exports = router;
