const mongoose = require("mongoose");
const dotenv = require("dotenv").config({ path: __dirname + "/.env" });

mongoose.connect(process.env.DBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("connected", () => {
  console.log("connected to database");
});

let Schema = mongoose.Schema;
let messageQueueScehma = new Schema({
  id: String,
  // type => create/update
  type: String,
  body: Object,
  status: { type: String, default: "pending" },
});

// MODEL

data = {
  id: "id1",
  // type: "metadata",
  body: { id: 1, title: "salary" },
};
let messageQ = mongoose.model("messageQueue", messageQueueScehma);

module.exports = messageQ;

const fun = async () => {
  console.log("in func");
  let result = await messageQ.find(data);
  console.log(result);
};

// fun();
// db.once("open", function () {
//   // we're connected!
//   console.log("connected");
// });
