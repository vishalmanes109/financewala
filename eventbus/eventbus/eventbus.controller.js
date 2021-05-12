const fetch = require("node-fetch");
const dotenv = require("dotenv").config({ path: __dirname + "/.env" });
const { saveDataInDB, deleteData, getData } = require("./eventbus.service");

module.exports = {
  addMetaData: async (req, res) => {
    // send data to the stats

    let metadata = req.body;
    console.log("metadata: from event bus controller", metadata);

    let result = await saveDataInDB(metadata);
    console.log("result: in controller", result);
    if (result.error) {
      return res.status(500).json({
        success: 0,
        message: "Storing data into messageQueue failed!",
      });
    } else {
      return res.status(200).json({
        success: 1,
        message: "Storing data into messageQueue successful",
      });
    }
  },
  deleteMetaData: async (req, res) => {
    // send data to the stats

    let data_id = req.params.data_id;
    console.log("metadata: from controller", metadata);

    let result = await deleteData(data_id);
    if (result.error) {
      return res.status(500).json({
        success: 0,
        message: "deletion failed!",
      });
    } else {
      return res.status(200).json({
        success: 1,
        message: "deletion successful",
      });
    }
  },
  getMetaData: async (req, res) => {
    // send data to the stats

    let result = await getData();
    if (result.error) {
      return res.status(500).json({
        success: 0,
        message: "No Data found!",
      });
    } else {
      return res.status(200).json({
        success: 1,
        data: result,
      });
    }
  },
};
