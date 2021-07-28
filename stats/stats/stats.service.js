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
  updateTransactionMetaData: async (transactionMetaData) => {
    try {
      let result;
      result = await pool.query(
        `update  trans_metadata set title =$1,amount=$2,date=$3,mode_of_payment=$4, category_id=$5, essential=$6,transaction_type_id=$7,user_id=$8 where id=$9`,
        [
          transactionMetaData.title,
          transactionMetaData.amount,
          transactionMetaData.date,
          transactionMetaData.mode_of_payment,
          transactionMetaData.category_id,
          transactionMetaData.essential,
          transactionMetaData.transaction_type_id,
          transactionMetaData.user_id,
          transactionMetaData.id,
        ]
      );
      // if (transactionMetaData.attribute === "title") {
      //   result = await pool.query(
      //     `update  trans_metadata set title =$1 where id=$2`,
      //     [transactionMetaData.title, transactionMetaData.id]
      //   );
      // }
      // if (transactionMetaData.attribute === "amount") {
      //   result = await pool.query(
      //     `update  trans_metadata set amount =$1 where id=$2`,
      //     [transactionMetaData.amount, transactionMetaData.id]
      //   );
      // }
      // if (transactionMetaData.attribute === "mode_of_payment") {
      //   result = await pool.query(
      //     `update  trans_metadata set mode_of_payment =$1 where id=$2`,
      //     [transactionMetaData.mode_of_payment, transactionMetaData.id]
      //   );
      // }
      // if (transactionMetaData.attribute === "category_id") {
      //   result = await pool.query(
      //     `update  trans_metadata set category_id =$1 where id=$2`,
      //     [transactionMetaData.category_id, transactionMetaData.id]
      //   );
      // }
      // if (transactionMetaData.attribute === "transaction_type_id") {
      //   result = await pool.query(
      //     `update  trans_metadata set transaction_type_id =$1 where id=$2`,
      //     [transactionMetaData.transaction_type_id, transactionMetaData.id]
      //   );
      // }
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
      // console.log(result);
      return result;
    } catch (err) {
      // console.log(err);
      return err;
    }
  },
  getPieChart: async (user_id, filter) => {
    try {
      let result;

      if (filter === "mode_of_payment")
        result = await pool.query(
          `select mode_of_payment,sum(amount) as total 
           from trans_metadata where user_id=$1 group by mode_of_payment ;`,
          [user_id]
        );
      else if (filter === "transaction_type")
        result = await pool.query(
          `select transaction_type.type,sum(trans_metadata.amount) as total 
           from trans_metadata,transaction_type where user_id=$1 and transaction_type_id=transaction_type.id 
           group by transaction_type.type ; `,
          [user_id]
        );
      else if (filter === "essential")
        result = await pool.query(
          `select essential,sum(amount) as total from trans_metadata where user_id=$1 group by essential ;`,
          [user_id]
        );
      else if (filter === "category") result = await pool.query(``, [user_id]);
      else {
        result = { message: "invalid filter" };
      }
      // console.log(result);
      return result;
    } catch (err) {
      // console.log(err);
      return err;
    }
  },
  getHeatMap: async (user_id, filter) => {
    try {
      let result;

      if (filter === "all")
        result = await pool.query(
          ` select date_trunc('day', date) as day,date_trunc('month', date) as month,date_trunc('month', date) as year, count(amount) as daily_activity
        from trans_metadata where user_id=$1 
        group by day,month,year;`,
          [user_id]
        );
      else if (filter === "income")
        result = await pool.query(
          ` select date_trunc('day', date) as day,date_trunc('month', date) as month,date_trunc('month', date) as year, count(amount) as daily_activity
        from trans_metadata where user_id=$1 and transaction_type_id=1
        group by day,month,year;`,
          [user_id]
        );
      else if (filter === "expense")
        result = await pool.query(
          ` select date_trunc('day', date) as day,date_trunc('month', date) as month,date_trunc('month', date) as year, count(amount) as daily_activity
        from trans_metadata where user_id=$1 and transaction_type_id=2
        group by day,month,year;`,
          [user_id]
        );
      else if (filter === "transfer")
        result = await pool.query(
          ` select date_trunc('day', date) as day,date_trunc('month', date) as month,date_trunc('month', date) as year, count(amount) as daily_activity
        from trans_metadata where user_id=$1 and transaction_type_id=3
        group by day,month,year;`,
          [user_id]
        );
      else {
        result = { message: "invalid filter" };
      }
      // console.log(result);
      return result;
    } catch (err) {
      // console.log(err);
      return err;
    }
  },
  getBarGraph: async (user_id, filter) => {
    try {
      // console.log(user_id, filter);
      let result;
      if (filter === "all")
        result = await pool.query(
          `select date_trunc('month', date) as month,date_trunc('year', date) as year, sum(amount) as monthly_sum
          from trans_metadata where user_id=$1
          group by  month,year;`,
          [user_id]
        );
      else if (filter === "income")
        result = await pool.query(
          `select date_trunc('month', date) as month,date_trunc('year', date) as year, sum(amount) as monthly_sum 
          from trans_metadata where user_id=$1 and transaction_type_id=1 
          group by month,year;`,
          [user_id]
        );
      else if (filter === "expense")
        result = await pool.query(
          `select date_trunc('month', date) as month,date_trunc('year', date) as year, sum(amount) as monthly_sum
          from trans_metadata where user_id=$1 and transaction_type_id=2
          group by month,year;`,
          [user_id]
        );
      else if (filter === "transfer")
        result = await pool.query(
          `select date_trunc('month', date) as month,date_trunc('year', date) as year, sum(amount) as monthly_sum 
          from trans_metadata where user_id=$1 and transaction_type_id=3 
          group by month,year;`,
          [user_id]
        );
      else {
        result = { message: "invalid filter" };
      }

      return result;
    } catch (err) {
      return err;
    }
  },
  getLineGraph: async (user_id, filter) => {
    try {
      let result;
      if (filter === "all")
        result = await pool.query(
          `select sum(amount),date_trunc('day', date) from trans_metadata 
        where user_id=$1 group by date_trunc('day', date) ;`,
          [user_id]
        );
      else if (filter === "income")
        result = await pool.query(
          `select sum(amount),date_trunc('day', date) from trans_metadata 
        where user_id=$1 and transaction_type_id=1
         group by date_trunc('day', date) ;`,
          [user_id]
        );
      else if (filter === "expense")
        result = await pool.query(
          `select sum(amount),date_trunc('day', date) from trans_metadata 
        where user_id=$1 and transaction_type_id=2 
        group by date_trunc('day', date) ;`,
          [user_id]
        );
      else if (filter === "transfer")
        result = await pool.query(
          `select sum(amount),date_trunc('day', date) from trans_metadata 
        where user_id=$1 and transaction_type_id=3
         group by date_trunc('day', date) ;`,
          [user_id]
        );
      else {
        result = { message: "invalid filter" };
      }
      // console.log(result);
      return result;
    } catch (err) {
      // console.log(err);
      return err;
    }
  },
  getTransactionMetaByAttribute: async (transactionData) => {
    try {
      let result = await pool.query(``, []);
      // console.log(result);
      return result;
    } catch (err) {
      // console.log(err);
      return err;
    }
  },
  addBulkTransMetaData: async (transactionMetaData) => {
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
      // console.log(result);
      return 1;
    } catch (err) {
      // console.log(err);
      return 0;
    }
  },
};
