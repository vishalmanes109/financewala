const fetch = require("node-fetch");
const { sign } = require("jsonwebtoken");

const {
  addTransacionMetaData,
  deleteTransacionMetaData,
  updateTransactionMetaData,
} = require("../stats/stats.service");

const manageMissedData = async (data) => {
  // sql query wants id parameter but service send us transaction_id so add id attribute to data
  let result = null;

  if (data.body.trans_type === "ADD") {
    // add missing data
    console.log("adding");
    result = await addTransacionMetaData(data.body);
    console.log(result);
  } else if (data.body.trans_type === "UPDATE") {
    console.log("updating");
    result = await updateTransactionMetaData(data.body);
    console.log(result);
  } else if (data.body.trans_type === "DELETE") {
    // delete bulk meta data
    console.log("deleting");

    result = await deleteTransacionMetaData(data.transaction_id);
    console.log(result);
  }

  if (result && result.rowCount > 0) {
    return {
      _id: data._id,
      transaction_id: data.body.id || data.body.transaction_id,
      trans_type: data.body.trans_type,
      success: 1,
    };
  } else
    return {
      _id: data._id,
      transaction_id: data.body.id || data.body.transaction_id,
      trans_type: data.body.trans_type,
      success: 0,
    };
};

module.exports = {
  dataFetchingScheduler: async () => {
    try {
      const serverToken = await sign(
        { payload: process.env.PAYLOAD },
        process.env.JWT_KEY || {}
      );
      let result = await fetch("http://localhost:3004/event/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Authorization: "Bearer " + serverToken,
        },
      });
      let dataJson = await result.json();
      let allData = dataJson.data;
      console.log("allData", allData);

      if (allData.length < 1) {
        console.log("no missed data found");
        return;
      }
      // once got all data save that data int database

      let missedDataResult = await Promise.all(
        allData.map((data) => manageMissedData(data))
      );
      console.log(missedDataResult);

      // call eventbus api to delete data
      // check which data has been managed succesfully and
      //  add that to array so that that data will get deleted
      let dataToBeDeleted = [];
      let dataManagementFailed = [];

      missedDataResult.forEach((data) => {
        if (data.success != null && data.success != 0) {
          dataToBeDeleted.push(data);
        } else {
          dataManagementFailed.push(data);
        }
      });
      if (dataManagementFailed.length > 0) {
        // log this and notify admin to manage this data manually
        console.log(
          "this metadata did not managed properly",
          dataManagementFailed
        );
      }

      // call event bus api to delete data
      console.log("dataToBeDeleted", dataToBeDeleted);
      let deleteMissedData = await fetch("http://localhost:3004/event", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Authorization: "Bearer " + serverToken,
        },
        body: JSON.stringify(dataToBeDeleted),
      });
      let deleteMissedDataResult = await deleteMissedData.json();
      console.log(deleteMissedDataResult);
      if (deleteMissedDataResult && deleteMissedDataResult.success !== 1) {
        console.log(
          "managing missed data failed notify admin for manual adding"
        );
        // add the trans id and trans type into log for manual debugging
      } else {
        console.log("missed data foud and managed properly");
      }
    } catch (err) {
      console.log(err);
    }
  },
};
