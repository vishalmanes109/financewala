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
    let allData = req.body;
    console.log("fro controller deletion", allData.length);
    // delete only thse data whose success=1 i.e it is properly managed in stats service
    // let dataToBeDeleted = [];
    // allData.forEach((data) => {
    //   if (data.success == 1) dataToBeDeleted.push(data);
    //   else {
    //     // log data whose success != 1 so that that can be handled manually
    //     console.log(data);
    //   }
    // });
    //

    if (allData.length === 0) {
      console.log("lol");
      return res.status(200).json({
        success: 1,
        message: "No data to be deleted ",
      });
    }

    try {
      let deleteDataResult = await Promise.all(
        allData.map((data) => {
          deleteData(data.transaction_id || data.id);
        })
      );
      console.log("deleteDataResult", deleteDataResult);
      if (deleteDataResult.includes(0)) {
        // logg this data and notify admin tio amually delete
        console.log(
          "managing missed data failed notify admin for manual adding"
        );
      }
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
  manageMetaData: async (req, res) => {},
};
