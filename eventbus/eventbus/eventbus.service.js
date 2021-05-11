const mongooes = require("mongoose");
const messageQ = require("../database");
module.exports = {
  saveDataInDB: async (data) => {
    //  save data
    let metadata = {};
    metadata.body = data;
    try {
      let result = await messageQ.create(metadata);
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
  getData: async (data) => {
    console.log(result);

    //  (error, data) => {
    //   if (error) {
    //     console.log(error);
    //     return error;
    //   }
    //   if (data) {
    //     console.log(data);
    //     return data;
    //   }
    // });
  },
  messageQueue: async () => {},
};
