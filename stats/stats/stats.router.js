const express = require("express");
const {
  addTransactionMetaData,
  deleteTransactionMetaData,
  updateTransactionMetaData,
  getDifferentCharts,
} = require("./stats.controller");
const router = express.Router();
const { verifyToken } = require("../utilities/auth");

router.post("/", addTransactionMetaData);
router.delete("/transaction_id/:transaction_id", deleteTransactionMetaData);
router.patch("/", updateTransactionMetaData);
router.get("/chart", getDifferentCharts);

module.exports = router;
