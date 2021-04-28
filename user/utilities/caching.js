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
          console.log(JSON.parse(data));
          res.status(200).json({
            success: 1,
            result: JSON.parse(data),
          });
        } else next();
      });
    } catch (err) {
      //   console.log(err);
      next();
    }
  },
};
