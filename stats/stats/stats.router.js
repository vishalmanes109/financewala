const express = require("express");
const {
  addTransactionMetaData,
  deleteTransactionMetaData,
  updateTransactionMetaData,
  getDifferentCharts,
} = require("./stats.controller");
const router = express.Router();
const { verifyToken } = require("../utilities/auth");

router.post("/", verifyToken, addTransactionMetaData);
router.delete(
  "/transaction_id/:transaction_id",
  verifyToken,
  deleteTransactionMetaData
);
router.patch("/", verifyToken, updateTransactionMetaData);
router.get("/chart", verifyToken, getDifferentCharts);

module.exports = router;
