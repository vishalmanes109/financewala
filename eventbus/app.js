const express = require("express");

const cors = require("cors");
const eventRouter = require("./eventbus/eventbus.router");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/event", eventRouter);

router.use("/evenbus");
app = express();
app.listen(3004, () => {
  console.log("event bus started on port 3004");
});
