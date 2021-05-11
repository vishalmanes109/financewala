const { pool } = require("../utilities/database");

module.exports = {
  addTransaction: async (transactionData) => {
    //  console.log(transactionData);
    try {
      let result;
      if (!transactionData.date) {
        let timestamp_result = await pool.query(`select now()`);

        transactionData.date = timestamp_result.rows[0].now;
      }
      result = await pool.query(
        `insert into transaction (id,title,description,amount,date,mode_of_payment,category_id,currency_id,transaction_type_id,user_id) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          transactionData.id,
          transactionData.title,
          transactionData.description,
          transactionData.amount,
          transactionData.date,
          transactionData.mode_of_payment,
          transactionData.category_id,
          transactionData.currency_id,
          transactionData.transaction_type_id,
          transactionData.user_id,
        ]
      );
      // console.log(result);
      return result;
    } catch (err) {
      // console.log(err);
      return err;
    }
  },
  // ----------- ADD TRANSACTION  DONE--------//

  deleteTransaction: async (transactionData) => {
    try {
      let result = await pool.query(
        `delete from transaction where id=$1 and user_id=$2`,
        [transactionData.id, transactionData.user_id]
      );
      // console .log(result);
      return result;
    } catch (err) {
      // console.log(err);
      return err;
    }
  },
  // -----------TRANSACTION DELETE DONE--------//

  updateTransaction: async (transactionData) => {
    try {
      let result;
      if (transactionData.attribute === "title") {
        result = await pool.query(
          `update  transaction set title =$1 where id=$2`,
          [transactionData.title, transactionData.id]
        );
      }
      if (transactionData.attribute === "description") {
        result = await pool.query(
          `update  transaction set description =$1 where id=$2`,
          [transactionData.description, transactionData.id]
        );
      }
      if (transactionData.attribute === "amount") {
        result = await pool.query(
          `update  transaction set amount =$1 where id=$2`,
          [transactionData.amount, transactionData.id]
        );
      }
      if (transactionData.attribute === "mode_of_payment") {
        result = await pool.query(
          `update  transaction set mode_of_payment =$1 where id=$2`,
          [transactionData.mode_of_payment, transactionData.id]
        );
      }
      if (transactionData.attribute === "category_id") {
        result = await pool.query(
          `update  transaction set category_id =$1 where id=$2`,
          [transactionData.category_id, transactionData.id]
        );
      }
      if (transactionData.attribute === "currency_id") {
        result = await pool.query(
          `update  transaction set currency_id =$1 where id=$2`,
          [transactionData.currency_id, transactionData.id]
        );
      }
      if (transactionData.attribute === "transaction_type_id") {
        result = await pool.query(
          `update  transaction set transaction_type_id =$1 where id=$2`,
          [transactionData.transaction_type_id, transactionData.id]
        );
      }
      // console.log(result);
      return result;
    } catch (err) {
      // console .log(err);
      return err;
    }
  },
  // -----------TRANSACTION UPDATE DONE--------//

  getTransactionByAttribute: async (transactionData) => {
    try {
      let result;
      if (transactionData.attribute === "date") {
        result = await pool.query(
          `select * from transaction where date >= $1 AND date <  $2 and user_id= $3`,
          [
            transactionData.start_date,
            transactionData.end_date,
            transactionData.user_id,
          ]
        );
      } else if (transactionData.attribute === "category_id") {
        result = await pool.query(
          `select * from transaction where category_id=$1 and user_id= $2`,
          [transactionData.category_id, transactionData.user_id]
        );
      } else if (transactionData.attribute === "mode_of_payment") {
        result = await pool.query(
          `select * from transaction where mode_of_payment=$1 and user_id= $2`,
          [transactionData.mode_of_payment, transactionData.user_id]
        );
      }
      // console.log(result);
      return result;
    } catch (err) {
      // console.log(err);
      return err;
    }
  },
  // -----------GET TRANSACTION  DONE--------//
  getTotalIncomeForMonth: async (transactionData) => {
    try {
      let result = await pool.query(
        `select sum(amount) from transaction where transaction_type_id=1 and user_id=$1 and date>$2 and date<$3`,
        [
          transactionData.user_id,
          transactionData.start_date,
          transactionData.end_date,
        ]
      );
      // console.log(result);
      return result;
    } catch (err) {
      // console.log(err);
      return err;
    }
  },
  getTotalExpenseForMonth: async (transactionData) => {
    try {
      let result = await pool.query(
        `select sum(amount) from transaction where transaction_type_id=2 and user_id=$1 and date>$2 and date<$3`,
        [
          transactionData.user_id,
          transactionData.start_date,
          transactionData.end_date,
        ]
      );
      // console.log(result);
      return result;
    } catch (err) {
      // console.log(err);
      return err;
    }
  },

  getTotalTransferForMonth: async (transactionData) => {
    try {
      let result = await pool.query(
        `select sum(amount) from transaction where transaction_type_id=3 and user_id=$1 and date>$2 and date<$3`,
        [
          transactionData.user_id,
          transactionData.start_date,
          transactionData.end_date,
        ]
      );
      // console.log(result);
      return result;
    } catch (err) {
      // console.log(err);
      return err;
    }
  },
  getRecentTransaction: async (user_id) => {
    try {
      let result = await pool.query(
        `select transaction.id,transaction.title,transaction.description,transaction.amount,transaction.date,transaction.transaction_type_id,transaction.user_id, currency.symbol from transaction,currency 
        where user_id=$1 and currency_id =currency.id  order by date Desc `,
        [user_id]
      );
      // console.log(result);
      return result;
    } catch (err) {
      // console.log(err);
      return err;
    }
  },
};
