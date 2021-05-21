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

const { verifyToken } = require("../utilities/auth");

router.get("/username/:username", isUserNameAvailable);
router.get("/userid/:userid", verifyToken, getUserById);
router.post("/", createUser);
router.get("/all", verifyToken, getUsers);
router.post("/login", login);
router.delete("/:id", verifyToken, deleteUser);
router.patch("/", verifyToken, updateUser);

module.exports = router;
