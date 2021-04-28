const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");

const transactionRouter = require("./manager/manager.router");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/transaction", transactionRouter);

app.get("/api", (req, res) => {
  return res.json({
    name: ["vishal", "vivek", "jayesh"],
    message: "lol",
  });
});

app.listen(process.env.PORT || 3006, () => {
  console.log(" tracker server up and running 3006");
});
