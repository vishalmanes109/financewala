const mongooes = require("mongoose");
const mongoDB = require("../database");
module.exports = {
  saveDataInDB: async (data) => {
    //  save data
    let metadata = {};
    metadata.body = data;
    metadata.transaction_id = data.transaction_id || data.id;
    try {
      let result = await mongoDB.create(metadata);
      // console.log("result of mongodb query", result);
      return result;
    } catch (err) {
      return {
        error: true,
        err,
      };
    }
  },
  deleteData: async (transaction_id, trans_type) => {
    try {
      console.log("from service deletion");
      let result = await mongoDB.deleteOne({ transaction_id: transaction_id });
      console.log("from servicereult:", result);

      if (result && result.deletedCount > 0) {
        console.log("lol");
        return {
          id: data.body.id || data.body.transaction_id,
          trans_type: trans_type,
          success: 1,
        };
      } else
        return {
          id: data.body.id || data.body.transaction_id,
          trans_type: trans_type,
          success: 0,
        };
    } catch (err) {
      console.log(err);
      return {
        success: 0,
      };
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
