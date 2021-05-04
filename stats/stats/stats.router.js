const express = require("express");
const {
  addTransactionMetaData,
  deleteTransactionMetaData,
  updateTransactionMetaData,
  getDifferentCharts,
} = require("./stats.controller");
const router = express.Router();

router.post("/", addTransactionMetaData);
router.delete("/user_id/:user_id", deleteTransactionMetaData);
router.patch("/", updateTransactionMetaData);
router.get("/user_id/:user_id/chart/:chart", getDifferentCharts);
