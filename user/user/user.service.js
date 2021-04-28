const pool = require("../utilities/database");

module.exports = {
  isUserNameAvailable: async (userName) => {
    try {
      let result = await pool.query(
        `select name from user_i where name like $1`,
        [userName]
      );
      // // // // console   .log(result);
      return result;
    } catch (err) {
      // // // // console   .log(err);
      return err;
    }
  },
  createUser: async (userData) => {
    // // // console   .log(userData);

    try {
      let timestamp_result = await pool.query(`select now()`);

      let created_on = timestamp_result.rows[0].now;

      let result = await pool.query(
        `insert into user_i(name,password,avatar,created_on,theme,last_login,currency_id) values($1,$2,$3,$4,$5,$6,$7)`,
        [
          userData.name,
          userData.password,
          userData.avatar,
          created_on,
          userData.theme,
          userData.last_login,
          userData.currency_id,
        ]
      );
      // // console  .log(result);
      return result;
    } catch (err) {
      // // console  .log(err);
      return err;
    }
  },
  deleteUser: async (userId) => {
    try {
      let result = await pool.query(`delete from user_i where id=$1`, [userId]);
      return result;
    } catch (err) {
      return err;
    }
  },
  updateUser: async (userData) => {
    try {
      let result;
      if (userData.attribute === "password") {
        result = await pool.query(
          `update user_i set password= $1 where id=$2`,
          [userData.password, userData.id]
        );
      }
      if (userData.attribute === "theme") {
        result = await pool.query(`update  user_i set theme= $1 where id= $2`, [
          userData.theme,
          userData.id,
        ]);
      }
      if (userData.attribute === "avatar") {
        result = await pool.query(
          ` update  user_i set avatar = $1 where id=$2`,
          [userData.avatar, userData.id]
        );
      }
      if (userData.attribute === "currency_id") {
        result = await pool.query(
          ` update  user_i set currency_id = $1 where id=$2`,
          [userData.currency_id, userData.id]
        );
      }
      // // console  .log(result);
      return result;
    } catch (err) {
      // // console  .log(err);
      return err;
    }
  },
  getUser: async () => {
    try {
      // // console  .log("lol");
      let result = await pool.query(`select *  from user_i`);
      // // console  .log(result);
      return result;
    } catch (err) {
      // // console  .log(err);
      return err;
    }
  },
  getUserById: async (userId) => {
    try {
      let result = await pool.query(`select * from user_i where id=$1`, [
        userId,
      ]);
      return result;
    } catch (err) {
      return err;
    }
  },
  login: async (userName) => {
    try {
      let result = await pool.query(
        `select name,password from user_i where name=$1`,
        [userName]
      );
      // // console  .log(result);
      return result;
    } catch (err) {
      // // console  .log(err);
      return err;
    }
  },
};
