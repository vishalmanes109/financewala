const {
  getTotalIncomeForMonth,
  getTotalTransferForMonth,
  getTotalExpenseForMonth,
} = require("../tracker/tracker.service");
const { redisClient } = require("../utilities/database");

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
  console.log(today, " ", month, " ", year, " ", start_date, " ", end_date);

  return { start_date, end_date };
};
const setCacheForNetMonthlyTransaction = async (user_id) => {
  let dateObject = getDateRange();

  let transactionData = {
    user_id,
    start_date: dateObject.start_date,
    end_date: dateObject.end_date,
  };
  console.log(transactionData);
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
    console.log("cacheDataString :", cacheDataString);
    return true;
  } else return false;
};
// console.log(setCacheForNetMonthlyTransaction(1));
