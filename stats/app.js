const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");

const fetch = require("node-fetch");
const statsRouter = require("./stats/stats.router");
const { manageMissedData } = require("./stats/stats.controller");
const { update } = require("../eventbus/database");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/stats", statsRouter);

app.get("/stats", (req, res) => {
  return res.json({
    name: ["vishal", "vivek", "jayesh"],
    message: "lol",
  });
});

app.listen(process.env.PORT || 3003, async () => {
  console.log("stats server up and running on 3003");

  // get the missed metadata from event bus
  try {
    let result = await fetch("http://localhost:3004/event/");
    let dataJson = await result.json();
    let allData = dataJson.data;
    console.log("allData", allData);

    if (allData.length < 1) {
      console.log("no missed data found");
      return;
    }

    // once got all data save that data int database
    let addData = [];
    let deleteData = [];
    let updateData = [];
    allData.forEach((data) => {
      if (data.trans_type === "ADD") addData.push(data);
      else if (data.trans_type === "UPDATE") updateData.push(data);
      else if (data.trans_type === "DELETE") deleteData.push(data);
      else {
        console.log("there is problem with data fetched from eventbus");
        //log adn notify admin
      }
    });
    console.log(addDataResult, " :", updateDataResult, ":", deleteDataResult);
    let addDataResult = await Promise.all(
      addData.map((data) => {
        manageMissedData(data);
      })
    );
    console.log(addDataResult);

    let updateDataResult = await Promise.all(
      updateData.map((data) => {
        manageMissedData(data);
      })
    );
    console.log(updateDataResult);
    let deleteDataResult = await Promise.all(
      deleteData.map((data) => {
        manageMissedData(data);
      })
    );
    console.log(deleteDataResult);

    let missedDataResult = [];
    missedDataResult = addDataResult.concat(updateDataResult, deleteDataResult);

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
      },
      body: JSON.stringify(dataToBeDeleted),
    });
    let deleteMissedDataResult = await deleteMissedData.json();
    console.log(deleteMissedDataResult);
    if (deleteMissedDataResult && deleteMissedDataResult.success !== 1) {
      console.log("managing missed data failed notify admin for manual adding");
      // add the trans id and trans type into log for manual debugging
    } else {
      console.log("missed data foud and managed properly");
    }
  } catch (err) {
    console.log(err);
  }
});
