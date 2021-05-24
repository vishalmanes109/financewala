const mongoose = require("mongoose");
require("dotenv").config({ path: __dirname + "/.env" });

let db;
try {
  mongoose.connect(process.env.DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db = mongoose.connection;
  db.on("connected", () => {
    console.log("connected to database");
  });
} catch (err) {
  console.log(err);
}
let Schema = mongoose.Schema;
let messageQueueScehma = new Schema({
  transaction_id: String,
  // type => create/update
  type: String,
  body: Object,
  status: { type: String, default: "pending" },
});

// MODEL

let mongoDB = mongoose.model("messageQueue", messageQueueScehma);

module.exports = mongoDB;

const fun = async () => {
  console.log("in func");
  let result = await mongoDB.find({});
  console.log("DB has :", result.length, " documets");
};

// fun();
