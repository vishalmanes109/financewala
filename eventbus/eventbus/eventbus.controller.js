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
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Server Error!",
      });
    }
  },
  deleteMetaData: async (req, res) => {
    let allData = req.body;
    console.log("fro controller deletion", allData);

    if (allData.length === 0) {
      console.log("lol");
      return res.status(200).json({
        success: 1,
        message: "No data to be deleted ",
      });
    }

    try {
      let deleteDataResult = await deleteData(allData);
      if (deleteDataResult && deleteDataResult.success === 1) {
        console.log(
          "managing missed data failed notify admin for manual adding"
        );
        return res.status(500).json({
          success: 1,
          message: "deletion successful!",
        });
      } else {
        // log this data and notify admin tio amually delete
        console.log(
          "managing missed data failed notify admin for manual adding"
        );
        return res.status(500).json({
          success: 0,
          message: "deletion failed!",
        });
      }
    } catch (err) {
      console.log(err);
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
  manageMetaData: async (req, res) => {},
};
