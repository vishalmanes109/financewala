const fetch = require("node-fetch");
const dotenv = require("dotenv").config({ path: __dirname + "/.env" });
const { saveDataInDB, deleteData, getData } = require("./eventbus.service");

module.exports = {
  addMetaData: async (req, res) => {
    // send data to the stats

    let metadata = req.body;
    console.log("metadata: from event bus controller", metadata);
    try {
      let result = await saveDataInDB(metadata);
      console.log("result: in controller", result);
      if (result.error) {
        return res.status(500).json({
          success: 0,
          message: "Storing data  failed!",
        });
      } else {
        console.log("data sored ib evntbus");
        return res.status(200).json({
          success: 1,
          message: "Storing data  successful",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: 0,
        message: "Server Error!",
      });
    }
  },
  deleteMetaData: async (req, res) => {
    console.log("fro controller deletion");
    try {
      let result = await deleteData();
      console.log("frm controller result:", result);
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
    } catch (err) {
      return res.status(500).json({
        success: 0,
        message: "Server Error!",
      });
    }
  },
  getMetaData: async (req, res) => {
    // send data to the stats
    console.log("inside getadata controller");
    try {
      let result = await getData();

      console.log("result in controller:", result);

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
    } catch (err) {
      return res.status(500).json({
        success: 0,
        message: "Server Error!",
      });
    }
  },
};
