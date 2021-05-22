const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");
require("dotenv").config({ path: __dirname + "/.env" });
const userRouter = require("./user/user.router");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRouter);

app.listen(process.env.PORT || 3001, () => {
  console.log("user  server up and running on 3001");
});
