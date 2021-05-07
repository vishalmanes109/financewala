const mongoose = require("mongoose");

console.log("lol");
mongoose.connect(
  "mongodb+srv://vishal:vishal@cluster0.2xsbh.mongodb.net/financewala?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
db.on("connected", () => {
  console.log("connected to database");
});

let Schema = mongoose.Schema;
let messageQueueScehma = new Schema({
  id: String,
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

fun();
// db.once("open", function () {
//   // we're connected!
//   console.log("connected");
// });
