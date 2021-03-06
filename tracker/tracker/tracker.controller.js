const {
  addTransaction,
  deleteTransaction,
  updateTransaction,
  getTransactionByAttribute,
  getTotalIncomeForMonth,
  getTotalExpenseForMonth,
  getTotalTransferForMonth,
  getRecentTransaction,
  getTransactionById,
  getTransactionByPeriod,
} = require("./tracker.service");

const { nanoid } = require("nanoid/async");

const { redisClient } = require("../utilities/database");
const fetch = require("node-fetch");
const {
  cleaning,
  isValidAmount,
  isValidString,
} = require("../utilities/validator");

const getDateRange = () => {
  let start_date;
  let end_date;
  let months = ["01", "03", "05", "07", "08", "10", "12"];
  let today = new Date();
  let month = String(today.getMonth() + 1).padStart(2, "0"); //January is 0
  let year = today.getFullYear();
  start_date = month + "/" + "01" + "/" + year;

  if (month === "02") {
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
      end_date = month + "/" + "29" + "/" + year;
    else end_date = month + "/" + "28" + "/" + year;
  }

  if (months.includes(month)) end_date = month + "/" + "31" + "/" + year;
  else end_date = month + "/" + "30" + "/" + year;
  // console.log(today, " ", month, " ", year, " ", start_date, " ", end_date);

  return { start_date, end_date };
};
const setCacheForNetMonthlyTransaction = async (user_id) => {
  let dateObject = getDateRange();

  let transactionData = {
    user_id,
    start_date: dateObject.start_date,
    end_date: dateObject.end_date,
  };
  // console.log(transactionData);
  let totalIncome = await getTotalIncomeForMonth(transactionData);
  let totalExpense = await getTotalExpenseForMonth(transactionData);
  let TotalTransfer = await getTotalTransferForMonth(transactionData);

  let cacheData = [];
  cacheData.push({
    name: "income",
    total: totalIncome.rows[0].sum,
  });
  cacheData.push({
    name: "expense",
    total: totalExpense.rows[0].sum,
  });
  cacheData.push({
    name: "transfer",
    total: TotalTransfer.rows[0].sum,
  });

  // caching the result
  let cacheDataString = JSON.stringify(cacheData);
  redisClient.hmset(`user${user_id}`, ["totalTransaction", cacheDataString]);

  if (
    totalIncome.rowCount > 0 &&
    totalExpense.rowCount > 0 &&
    TotalTransfer.rowCount > 0
  ) {
    // console.log("cacheDataString :", cacheDataString);
    return true;
  } else return false;
};
const setCacheForRecentTransaction = async (user_id) => {
  let result = await getRecentTransaction(user_id);
  if (result.rowCount > 0) {
    let resultString = JSON.stringify(result.rows);
    redisClient.hmset(`user${user_id}`, ["recentTransaction", resultString]);
    return true;
  }
  return false;
};

module.exports = {
  addTransaction: async (req, res) => {
    let transactionData = req.body;
    transactionData.id = await nanoid(10);
    // console.log(transactionData);
    transactionData.title = cleaning(transactionData.title);
    transactionData.description = cleaning(transactionData.description);
    transactionData.mode_of_payment = cleaning(transactionData.mode_of_payment);

    if (
      !isValidAmount(transactionData.amount) ||
      !isValidString(transactionData.title) ||
      !isValidString(transactionData.description) ||
      !isValidString(transactionData.mode_of_payment)
    )
      return res.status(400).json({
        success: 0,
        message: "invalide data",
      });
    try {
      let result = await addTransaction(transactionData);
      if (result.name)
        return res.status(500).json({
          success: 0,
          message: "Error in query!",
        });

      if (result.rowCount > 0) {
        if (!setCacheForNetMonthlyTransaction(transactionData.user_id))
          // caching failed the delete previous caching
          redisClient.HDEL(`user${transaction.user_id}`, "totalTransaction");
        if (!setCacheForRecentTransaction(transactionData.user_id))
          // caching failed the delete previous caching
          redisClient.HDEL(`user${transaction.user_id}`, "recentTransaction");

        // post this data to Stats service
        transactionData.trans_type = "ADD";
        console.log(transactionData);
        let statsResult = null;
        try {
          const clientToken = req.headers.Authorization;
          let statsResponse = await fetch("http://localhost:3003/stats", {
            method: "POST",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              Authorization: "Bearer " + clientToken,
            },
            body: JSON.stringify(transactionData),
          });
          console.log("stats statsResponse", statsResponse);

          statsResult = await statsResponse.json();
          console.log("stats result", statsResult);
        } catch (err) {
          console.log(err);
        }
        // if stats service is down  so stastResult always be null and
        // if stats service failed to store data statsResult.sucess will be 0
        if (statsResult === null || statsResult.success != 1) {
          // if stats service failed to recieve data post data to event bus
          const clientToken = req.headers.Authorization;

          let eventResponse = await fetch("http://localhost:3004/event", {
            method: "POST",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              Authorization: "Bearer " + clientToken,
            },
            body: JSON.stringify(transactionData),
          });

          let eventResult = await eventResponse.json();
          console.log(" from event result", eventResult);
        }

        return res.status(200).json({
          success: 1,
          message: "Transaction added sucessfully!",
        });
      }
      return res.status(400).json({
        success: 0,
        message: "transaction failed!",
      });
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        success: 0,
        message: "Server Error!",
      });
    }
  },
  deleteTransaction: async (req, res) => {
    let { transaction_id, user_id } = req.query;
    let transactionData = {
      transaction_id,
      user_id,
    };
    console.log(
      "from tracker controller deletion of statrted",
      transactionData
    );

    try {
      let result = await deleteTransaction(transaction_id);
      if (result && result.name)
        return res.status(500).json({
          success: 0,
          message: "Error in query!",
        });
      if (result && result.rowCount > 0) {
        if (!setCacheForNetMonthlyTransaction(transactionData.user_id))
          // caching failed the delete previous caching
          redisClient.HDEL(
            `user${transactionData.user_id}`,
            "totalTransaction"
          );
        if (!setCacheForRecentTransaction(transactionData.user_id))
          // caching failed the delete previous caching
          redisClient.HDEL(
            `user${transactionData.user_id}`,
            "recentTransaction"
          );

        transactionData.trans_type = "DELETE";
        let statsResult = null;
        try {
          const clientToken = req.headers.Authorization;

          let statsResponse = await fetch(
            `http://localhost:3003/stats/transaction_id/${transactionData.transaction_id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json;charset=utf-8",
                Authorization: "Bearer " + clientToken,
              },
              body: JSON.stringify(transactionData),
            }
          );

          statsResult = await statsResponse.json();
        } catch (err) {
          console.log(err);
        }

        if (statsResult === null || statsResult.success != 1) {
          const clientToken = req.headers.Authorization;

          // if stats service failed to recieve data post data to event bus
          let eventResponse = await fetch("http://localhost:3004/event", {
            method: "POST",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              Authorization: "Bearer " + clientToken,
            },
            body: JSON.stringify(transactionData),
          });

          let eventResult = await eventResponse.json();
          console.log("result from eventbus,", eventResult);
        }

        return res.status(200).json({
          success: 1,
          message: "Transaction deleted sucessful!",
        });
      }
      return res.status(400).json({
        success: 0,
        message: "transaction id does not exist",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Server Error!",
      });
    }
  },
  updateTransaction: async (req, res) => {
    let transactionData = req.body;
    console.log(transactionData);
    transactionData.title = cleaning(transactionData.title);
    transactionData.description = cleaning(transactionData.description);
    transactionData.mode_of_payment = cleaning(transactionData.mode_of_payment);
    if (!isValidAmount(transactionData.amount))
      return res.status(500).json({
        success: 0,
        message: "invalide amount",
      });
    try {
      let result = await updateTransaction(transactionData);
      console.log("result in controller", result);
      if (result && result.name)
        return res.status(500).json({
          success: 0,
          message: "Error in query!",
        });
      if (result && result.rowCount > 0) {
        // totalTransactionData
        if (!setCacheForNetMonthlyTransaction(transactionData.user_id))
          // caching failed the delete previous caching
          redisClient.HDEL(`user${transaction.user_id}`, "totalTransaction");
        // recent Transaction Data
        if (!setCacheForRecentTransaction(transactionData.user_id))
          // caching failed the delete previous caching
          redisClient.HDEL(`user${transaction.user_id}`, "recentTransaction");

        transactionData.trans_type = "UPDATE";
        let statsResult = null;
        try {
          const clientToken = req.headers.Authorization;

          let statsResponse = await fetch("http://localhost:3003/stats", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              Authorization: "Bearer " + clientToken,
            },
            body: JSON.stringify(transactionData),
          });
          console.log(statsResponse);

          // statsResult = await statsResponse.json();
          statsResult = {};
        } catch (err) {
          console.log(err);
        }

        if (statsResult === null || statsResult.success != 1) {
          const clientToken = req.headers.Authorization;

          // if stats service failed to recieve data post data to event bus
          let eventResponse = await fetch("http://localhost:3004/event", {
            method: "POST",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              Authorization: "Bearer " + clientToken,
            },
            body: JSON.stringify(transactionData),
          });

          let eventResult = await eventResponse.json();
          console.log("result from eventbus,", eventResult);
        }

        return res.status(200).json({
          success: 1,
          message: "Transaction updated sucessfully!",
        });
      }
      return res.status(500).json({
        success: 0,
        message: "transaction updation  failed!",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Server Error!",
      });
    }
  },
  getAllTransactionForMonth: async (req, res) => {
    // console.log("from controller");
    let start_date;
    let end_date;
    let user_id = req.params.user_id;
    if (!req.query.start_date && !req.query.end_date) {
      let dateObject = getDateRange();
      start_date = dateObject.start_date;
      end_date = dateObject.end_date;
    } else {
      start_date = req.query.start_date;
      end_date = req.query.end_date;
    }

    let transactionData = {
      user_id,
      start_date,
      end_date,
    };
    try {
      let totalIncome = await getTotalIncomeForMonth(transactionData);
      let totalExpense = await getTotalExpenseForMonth(transactionData);
      let TotalTransfer = await getTotalTransferForMonth(transactionData);

      let result = [];
      result.push({
        name: "income",
        total: totalIncome.rows[0].sum,
      });
      result.push({
        name: "expense",
        total: totalExpense.rows[0].sum,
      });
      result.push({
        name: "transfer",
        total: TotalTransfer.rows[0].sum,
      });
      // caching the result
      if (
        totalIncome.rowCount > 0 &&
        totalExpense.rowCount > 0 &&
        TotalTransfer.rowCount > 0
      ) {
        let resultString = JSON.stringify(result);
        redisClient.hmset(`user${user_id}`, ["totalTransaction", resultString]);

        return res.status(200).json({
          success: 1,
          result: result,
        });
      }
      if (totalIncome.name && totalExpense.name && TotalTransfer.name)
        return res.status(500).json({
          success: 0,
          message: "error in query",
        });
      return res.status(500).json({
        success: 0,
        message: "No data for given user found",
      });
    } catch (err) {
      return res.status(500).json({
        success: 0,
        message: "Server Error!",
      });
    }
  },
  getRecentTransaction: async (req, res) => {
    // console.log("from controller : recent trans..");
    let user_id = req.params.userid;
    console.log(user_id);
    try {
      let result = await getRecentTransaction(user_id);
      console.log(result);
      if (result.name)
        return res.status(500).json({
          success: 0,
          message: "Error in query!",
        });
      if (result.rowCount > 0) {
        let resultString = JSON.stringify(result.rows);
        // console.log("resultStr: ", resultString);
        redisClient.hmset(`user${user_id}`, [
          "recentTransaction",
          resultString,
        ]);
        return res.status(200).json({
          success: 1,
          result: result.rows,
        });
      }
      return res.status(400).json({
        success: 0,
        message: "0 result found!",
      });
    } catch (err) {
      return res.status(500).json({
        success: 0,
        message: "Server Error!",
      });
    }
  },
  getTransactionByAttribute: async (req, res) => {
    let { attribute, value, id } = req.query;
    transactionData = {
      user_id: id,
      attribute,
      value,
    };

    console.log(transactionData);
    try {
      let result = await getTransactionByAttribute(transactionData);
      console.log("result.rows", result.rows);
      if (result.name)
        return res.status(500).json({
          success: 0,
          message: "Error in query!",
        });
      if (result.rowCount > 0)
        return res.status(200).json({
          success: 1,
          message: "Transacion sucessful!",
          result: result.rows,
        });
      return res.status(400).json({
        success: 0,
        message: "0 result found!",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Server Error!",
      });
    }
  },
  getTransactionById: async (req, res) => {
    let { id } = req.params;

    console.log(id);
    try {
      let result = await getTransactionById(id);
      console.log("result", result);

      if (result.name)
        return res.status(500).json({
          success: 0,
          message: "Error in query!",
        });
      if (result.rowCount > 0)
        return res.status(200).json({
          success: 1,
          message: "Transacion sucessful!",
          result: result.rows,
        });
      return res.status(400).json({
        success: 0,
        message: "0 result found!",
      });
    } catch (err) {
      return res.status(500).json({
        success: 0,
        message: "Server Error!",
      });
    }
  },
  getTransactionByPeriod: async (req, res) => {
    let { start, end, id } = req.query;

    let transactionData = {
      start,
      end,
      user_id: id,
    };
    console.log(transactionData);
    try {
      let result = await getTransactionByPeriod(transactionData);
      console.log("result", result);

      if (result.name)
        return res.status(500).json({
          success: 0,
          message: "Error in query!",
        });
      if (result.rowCount > 0)
        return res.status(200).json({
          success: 1,
          message: "Transaction found!",
          result: result.rows,
        });
      return res.status(400).json({
        success: 0,
        message: "0 result found!",
      });
    } catch (err) {
      return res.status(500).json({
        success: 0,
        message: "Server Error!",
      });
    }
  },
};
