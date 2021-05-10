const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config({ path: __dirname + "/.env" });

const bodyParser = require("body-parser");

const eventRouter = require("./eventbus/eventbus.router");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/event", eventRouter);

app.get("/api", (req, res) => {
  return res.json({
    name: ["vishal", "vivek", "jayesh"],
    message: "lol",
  });
});
// app.post("/event", (req, res) => {
//   console.log(req.body);
//   return res.send("lol");
// });

app.listen(process.env.PORT || 3004, () => {
  console.log(" tracker server up and running 3004");
});
