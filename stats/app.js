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
    // allData = JSON.parse(allData);
    console.log("allData", allData);
    if (allData.data === 0) {
      console.log("no missed adata found");
      return;
    }

    // once got all data save that data int database

    // let missedDataResult = await manageMissedData(allData);
    let missedDataResult = await Promise.all(
      allData.map((data) => manageMissedData(data))
    );
    console.log(missedDataResult);
    for (let i = 0; i < missedDataResult.length; i++) {
      if (missedDataResult[i].success !== 1) {
        console.log(
          "managing missed data failed notify admin for manual adding"
        );
        // add the trans id and trans type into log for manual debugging
        break;
      } else console.log("missed data foud and managed properly");
    }
    // missedDataResult.map((result) => {

    //   if (result.success !== 1) {
    //     console.log(
    //       "managing missed data failed notify admin for manual adding"
    //     );
    //     break;
    //   } else {
    //     console.log("missed data foud and managed properly");
    //   }
    // });
  } catch (err) {
    console.log(err);
  }
});
