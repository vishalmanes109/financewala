const express = require("express");
const cors = require("cors");

require("dotenv").config({ path: __dirname + "/.env" });

const transactionRouter = require("./tracker/tracker.router");

const app = express();

app.use(express.json());
app.use(cors());
app.get("/lol", (req, res) => {
  res.send("lol");
});
app.use("/transaction", transactionRouter);

app.listen(process.env.PORT || 3002, () => {
  console.log(" tracker server up and running 3002");
});
