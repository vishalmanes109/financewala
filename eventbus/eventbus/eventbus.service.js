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
  deleteData: async (transaction_id) => {},
  getData: async () => {
    try {
      let result = await mongoDB.find({});
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
      return {
        error: true,
        err,
      };
    }
  },
  messageQueue: async () => {},
};
