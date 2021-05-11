const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");

const fetch = require("node-fetch");
const statsRouter = require("./stats/stats.router");
const { addMissedData } = require("./stats/stats.controller");

const app = express();

app.use(express.json());
app.use(cors());

// app.use("/stats", statsRouter);

app.post("/stats", (req, res) => {
  console.log("from stats :", req.body);
  return res.status(200).json({
    success: 0,
    message: "data got",
  });
});

app.get("/api", (req, res) => {
  return res.json({
    name: ["vishal", "vivek", "jayesh"],
    message: "lol",
  });
});

app.listen(process.env.PORT || 3003, async () => {
  console.log("stats server up and running on 3003");

  // get the missed metadata from event bus

  let result = await fetch("http://localhost:3004/event/all");
  let allData = await result.json();
  console.log(allData);

  // once got all data save that data int database

  let missedDataResult = await addMissedData(allData);
  if (missedDataResult == 1) console.log("missed data foud and added");
  else console.log("no missed data so far");
});
