const { redisClient } = require("../utilities/database");

module.exports = {
  //     "user user_id":{
  //          totalTransactionForMonth:"string of JSOn object storing totla expense,imcome,transfer"
  //          theme : "true"/"false"
  //   data o draw chart will be stored here
  //  }
  //
  //
  getCachedAllTransactionForMonth: async (req, res, next) => {
    let { user_id } = req.params;
    try {
      redisClient.hget(`user${user_id}`, "totalTransaction", (err, data) => {
        if (err) {
          console.log("err" + err);
          next();
        } else if (data) {
          console.log("from caching: ", JSON.parse(data));
          res.status(200).json({
            success: 1,
            result: JSON.parse(data),
          });
        } else {
          console.log("data", data);

          next();
        }
      });
    } catch (err) {
      console.log(err);
      next();
    }
  },
  getCachedRecentTransaction: async (req, res, next) => {
    let { user_id } = req.params;
    console.log(user_id);
    try {
      redisClient.hget(`user${user_id}`, "recentTransaction", (err, data) => {
        if (err) {
          console.log("err" + err);
          next();
        } else if (data) {
          console.log("from caching: ", JSON.parse(data));
          res.status(200).json({
            success: 1,
            result: JSON.parse(data),
          });
        } else {
          console.log("data", data);

          next();
        }
      });
    } catch (err) {
      console.log(err);
      next();
    }
  },
};
