const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");

const fetch = require("node-fetch");
const statsRouter = require("./stats/stats.router");
const { manageMissedData } = require("./stats/stats.controller");

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

    let missedDataResult = await Promise.all(
      allData.map((data) => manageMissedData(data))
    );
    console.log(missedDataResult);
    // call eventbus api to delete data
    let dataToBeDeleted = [];
    missedDataResult.forEach((data) => {
      if (data.success != null && data.success != 0) {
        dataToBeDeleted.push(data);
      }
    });
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
