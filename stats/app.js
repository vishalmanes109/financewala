const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");

// const userRouter = require("./api/user/user.router");
// const transactionRouter = require("./api/manager/manager.router");

const app = express();

app.use(express.json());
app.use(cors());

// app.use("/stats", userRouter);

app.post("/stats", (req, res) => {
  console.log(req.body);
  return res.status(200).json({
    success: 1,
    message: "data got",
  });
});

app.get("/api", (req, res) => {
  return res.json({
    name: ["vishal", "vivek", "jayesh"],
    message: "lol",
  });
});

app.listen(process.env.PORT || 3003, () => {
  console.log("stats server up and running on 3003");
});
