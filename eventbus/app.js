const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });

const eventRouter = require("./eventbus/eventbus.router");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/event", eventRouter);

app.listen(process.env.PORT || 3004, () => {
  console.log(" event server up and running 3004");
});
