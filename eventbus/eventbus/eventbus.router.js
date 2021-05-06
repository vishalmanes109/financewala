const express = require("express");
const { addMetaData } = require("./eventbus.controller");
const router = express.Router();

router.post("/", addMetaData);
// router.post();
// router.get();

module.exports = router;
