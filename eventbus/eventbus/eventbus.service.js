const mongooes = require("mongoose");
const messageQ = require("../database");
module.exports = {
  saveDataInDB: async (data) => {
    //  save data
    let result = await messageQ.create(data);
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
