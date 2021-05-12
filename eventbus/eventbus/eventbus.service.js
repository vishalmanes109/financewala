const mongooes = require("mongoose");
const mongoDB = require("../database");
module.exports = {
  saveDataInDB: async (data) => {
    //  save data
    let metadata = {};
    metadata.body = data;
    try {
      let result = await mongoDB.create(metadata);
      console.log("result of mongodb query", result);
      return result;
    } catch (err) {
      return {
        error: true,
        err,
      };
    }
  },
  deleteData: async () => {
    try {
      console.log("from service deletion");
      let result = await mongoDB.remove({});
      console.log("from servicereult:", result);
      return result;
    } catch (err) {
      console.log(err);
      return { error: true, err };
    }
  },
  getData: async () => {
    try {
      console.log("iside try service");
      let result = await mongoDB.find({});
      console.log("result from service:", result);
      console.log("end of result fron service");
      return result;
    } catch (err) {
      console.log("err from service:", err);
      return {
        error: true,
        err,
      };
    }
  },
  messageQueue: async () => {},
};
