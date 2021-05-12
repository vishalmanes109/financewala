const express = require("express");
const {
  addMetaData,
  getMetaData,
  deleteMetaData,
} = require("./eventbus.controller");
const router = express.Router();

router.post("/", addMetaData);
// router.post();
router.get("/", getMetaData);
router.delete("/", deleteMetaData);

module.exports = router;
