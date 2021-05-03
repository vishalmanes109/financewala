const express = require("express");
const {
  addTransaction,
  deleteTransaction,
  getTransactionByAttribute,
  updateTransaction,
  getAllTransactionForMonth,
  getRecentTransaction,
} = require("./tracker.controller");
const { getCachedAllTransactionForMonth } = require("../utilities/caching");
const router = express.Router();

router.get("/", getTransactionByAttribute);
router.get(
  "/total/:user_id",
  getCachedAllTransactionForMonth,
  getAllTransactionForMonth
);
router.get("/recent/:userid", getRecentTransaction);
router.post("/", addTransaction);
router.patch("/", updateTransaction);
router.delete("/", deleteTransaction);
module.exports = router;
