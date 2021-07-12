const express = require("express");
const {
  addTransaction,
  deleteTransaction,
  getTransactionByAttribute,
  updateTransaction,
  getAllTransactionForMonth,
  getRecentTransaction,
  getTransactionById,
} = require("./tracker.controller");
const {
  getCachedAllTransactionForMonth,
  getCachedRecentTransaction,
} = require("../utilities/caching");

const { verifyToken } = require("../utilities/auth");

const router = express.Router();
router.get("/id/:id",   getTransactionById);

router.get("/",   getTransactionByAttribute);
router.get(
  "/total/:user_id",
  getCachedAllTransactionForMonth,
  getAllTransactionForMonth
);

router.get(
  "/recent/:user_id",
  getCachedRecentTransaction,
  getRecentTransaction
);
router.post("/", addTransaction);
router.patch("/", updateTransaction);
router.delete("/", deleteTransaction);
module.exports = router;
