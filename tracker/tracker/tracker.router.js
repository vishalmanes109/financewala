const express = require("express");
const {
  addTransaction,
  deleteTransaction,
  getTransactionByAttribute,
  updateTransaction,
  getAllTransactionForMonth,
  getRecentTransaction,
} = require("./tracker.controller");
const {
  getCachedAllTransactionForMonth,
  getCachedRecentTransaction,
} = require("../utilities/caching");

const { verifyToken } = require("../utilities/auth");

const router = express.Router();

router.get("/", verifyToken, getTransactionByAttribute);
router.get(
  "/total/:user_id",
  verifyToken,
  getCachedAllTransactionForMonth,
  getAllTransactionForMonth
);

router.get(
  "/recent/:user_id",
  verifyToken,
  getCachedRecentTransaction,
  getRecentTransaction
);
router.post("/", verifyToken, addTransaction);
router.patch("/", verifyToken, updateTransaction);
router.delete("/", verifyToken, deleteTransaction);
module.exports = router;
