const {
  addTransaction,
  deleteTransaction,
  updateTransaction,
  getTransactionByAttribute,
  getTotalIncomeForMonth,
  getTotalExpenseForMonth,
  getTotalTransferForMonth,
  getRecentTransaction,
} = require("./tracker.service");

const { nanoid } = require("nanoid/async");
const { redisClient } = require("../utilities/database");
const { cleaning, isValidAmount } = require("../utilities/validator");

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
  setCacheForNetMonthlyTransaction,
  addTransaction: async (req, res) => {
    let transactionData = req.body;
    transactionData.id = await nanoid(10);
    // console.log(transactionData);
    transactionData.title = cleaning(transactionData.title);
    transactionData.description = cleaning(transactionData.description);
    transactionData.mode_of_payment = cleaning(transactionData.mode_of_payment);

    if (!isValidAmount(transactionData.amount))
      return res.status(400).json({
        success: 0,
        message: "invalide amount",
      });

    let result = await addTransaction(transactionData);
    if (result.name)
      return res.status(500).json({
        success: 0,
        message: "Error in query!",
      });
    if (result.rowCount > 0) {
      if (!setCacheForNetMonthlyTransaction(transactionData.user_id))
        // cashinf failed the delete previous caching
        redisClient.HDEL(`user${transaction.user_id}`, "totalTransaction");
      if (!setCacheForRecentTransaction(transactionData.user_id))
        // cashinf failed the delete previous caching
        redisClient.HDEL(`user${transaction.user_id}`, "recentTransaction");

      return res.status(200).json({
        success: 1,
        message: "Transaction added sucessful!",
      });
    }
    return res.status(400).json({
      success: 0,
      message: "transaction failed!",
    });
  },
  deleteTransaction: async (req, res) => {
    let transactionData = req.body;
    // console .log(transactionData);

    let result = await deleteTransaction(transactionData);
    if (result.name)
      return res.status(500).json({
        success: 0,
        message: "Error in query!",
      });
    if (result.rowCount > 0) {
      if (!setCacheForNetMonthlyTransaction(transactionData.user_id))
        // cashinf failed the delete previous caching
        redisClient.HDEL(`user${transaction.user_id}`, "totalTransaction");
      if (!setCacheForRecentTransaction(transactionData.user_id))
        // cashinf failed the delete previous caching
        redisClient.HDEL(`user${transaction.user_id}`, "recentTransaction");

      return res.status(200).json({
        success: 1,
        message: "Transaction deleted sucessful!",
      });
    }
    return res.status(400).json({
      success: 0,
      message: "transaction id does not exist",
    });
  },
  updateTransaction: async (req, res) => {
    let transactionData = req.body;
    // console .log(transactionData);

    transactionData.title = cleaning(transactionData.title);
    transactionData.description = cleaning(transactionData.description);
    transactionData.mode_of_payment = cleaning(transactionData.mode_of_payment);
    transactionData.attribute = cleaning(transactionData.attribute);

    if (!isValidAmount(transactionData.amount))
      return res.status(500).json({
        success: 0,
        message: "invalide amount",
      });

    let result = await updateTransaction(transactionData);
    if (result.name)
      return res.status(500).json({
        success: 0,
        message: "Error in query!",
      });
    if (result.rowCount > 0) {
      // totalTransactionData
      if (
        (transactionData.attribute === "amount" ||
          transactionData.attribute === "transaction_type_id") &&
        !setCacheForNetMonthlyTransaction(transactionData.user_id)
      )
        // cashinf failed the delete previous caching
        redisClient.HDEL(`user${transaction.user_id}`, "totalTransaction");
      // recent Transaction Data
      if (!setCacheForRecentTransaction(transactionData.user_id))
        // cashinf failed the delete previous caching
        redisClient.HDEL(`user${transaction.user_id}`, "recentTransaction");

      return res.status(200).json({
        success: 1,
        message: "Transaction updated sucessful!",
      });
    }
    return res.status(500).json({
      success: 0,
      message: "transaction failed!",
    });
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
  },
  getRecentTransaction: async (req, res) => {
    // console.log("from controller : recent trans..");
    let user_id = req.params.userid;

    let result = await getRecentTransaction(user_id);
    if (result.name)
      return res.status(500).json({
        success: 0,
        message: "Error in query!",
      });
    if (result.rowCount > 0) {
      let resultString = JSON.stringify(result.rows);
      // console.log("resultStr: ", resultString);
      redisClient.hmset(`user${user_id}`, ["recentTransaction", resultString]);
      return res.status(200).json({
        success: 1,
        result: result.rows,
      });
    }
    return res.status(400).json({
      success: 0,
      message: "0 result found!",
    });
  },

  getTransactionByAttribute: async (req, res) => {
    let transactionData = req.body;
    transactionData.id = await nanoid(10);
    // console.log(transactionData);

    let result = await getTransactionByAttribute(transactionData);
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
  },
};
