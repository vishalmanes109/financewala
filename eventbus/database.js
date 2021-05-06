const mongoose = require("mongoose");

console.log("lol");
mongoose.connect(
  "mongodb+srv://vishal:vishal@cluster0.2xsbh.mongodb.net/financewala?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("connected");
});
