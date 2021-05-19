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
  deleteData: async (data) => {
    console.log(data);
    let ids = [];
    data.forEach((d) => {
      ids.push(d._id);
    });
    console.log(ids);
    try {
      let result = await mongoDB.deleteMany({
        _id: { $in: ids },
      });
      console.log("from service deletion", result);
      return result;
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
