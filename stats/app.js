const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });

const statsRouter = require("./stats/stats.router");
// const { dataFetchingScheduler } = require("./utilities/scheduler");
const { dataFetchingScheduler } = require("./utilities/scheduler");

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

  // fetch and manage data this might failed for data with trans_type delete and update
  dataFetchingScheduler();

  // call same method after 2 minutes so that
  // this time all the data with Tras_type delete and update will managed properly
  setTimeout(() => {
    dataFetchingScheduler();
    console.log("called after 2 min");
  }, 1 * 60000);

  // schedular which fetches data and manages it after 30 min
  setInterval(() => {
    dataFetchingScheduler();
    console.log("called after 30 min");
  }, 30 * 60000);
});
