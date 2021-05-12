const e = require("express");
const { pool } = require("../utilities/database");
module.exports = {
  addTransacionMetaData: async (transactionMetaData) => {
    try {
      let result = await pool.query(
        `insert into trans_metadata 
      (id,title,amount,date,mode_of_payment,essential,category_id,transaction_type_id,user_id) 
      values($1,$2,$3,$4,$5,$6,$7,$8,$9) `,
        [
          transactionMetaData.id,
          transactionMetaData.title,
          transactionMetaData.amount,
          transactionMetaData.date,
          transactionMetaData.mode_of_payment,
          transactionMetaData.essential,
          transactionMetaData.category_id,
          transactionMetaData.transaction_type_id,
          transactionMetaData.user_id,
        ]
      );
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  updateTransacionMetaData: async (transactionMetaData) => {
    try {
      let result;
      if (transactionData.attribute === "title") {
        result = await pool.query(
          `update  trans_metadata set title =$1 where id=$2`,
          [transactionData.title, transactionData.id]
        );
      }

      if (transactionData.attribute === "amount") {
        result = await pool.query(
          `update  trans_metadata set amount =$1 where id=$2`,
          [transactionData.amount, transactionData.id]
        );
      }
      if (transactionData.attribute === "mode_of_payment") {
        result = await pool.query(
          `update  trans_metadata set mode_of_payment =$1 where id=$2`,
          [transactionData.mode_of_payment, transactionData.id]
        );
      }
      if (transactionData.attribute === "category_id") {
        result = await pool.query(
          `update  trans_metadata set category_id =$1 where id=$2`,
          [transactionData.category_id, transactionData.id]
        );
      }

      if (transactionData.attribute === "transaction_type_id") {
        result = await pool.query(
          `update  trans_metadata set transaction_type_id =$1 where id=$2`,
          [transactionData.transaction_type_id, transactionData.id]
        );
      }
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  deleteTransacionMetaData: async (transaction_id) => {
    try {
      let result = await pool.query(`delete from trans_metadata where id= $1`, [
        transaction_id,
      ]);
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  getPieChart: async (transactionMetaData) => {
    try {
    } catch (err) {}
  },
  getHeatMap: async (transactionMetaData) => {
    try {
    } catch (err) {}
  },
  getBarGraph: async (transactionMetaData) => {
    try {
    } catch (err) {}
  },
  getTransactionMetaByAttribute: async (transactionMetaData) => {
    try {
    } catch (err) {}
  },
};
