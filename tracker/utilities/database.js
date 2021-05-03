const { Pool } = require("pg");
const redis = require("redis");
//start caching server on port 6379
const redisClient = redis.createClient(6379);

const pool = new Pool({
  port: 5432 || process.env.PGDB_PORT,
  host: "localhost" || process.env.DB_HOST,
  user: "postgres" || process.env.PGUSER,
  password: "123" || process.env.PGDB_PASS,
  database: "transactionService" || process.env.MYSQL_DB,
});
// const pool = new Pool({
//   connectionString:
//     "postgres://vowjprxwkhzrex:2c9df496ecb601f8c15d7863b5391b17e181f7dffff7c38608f968b864a4638c@ec2-34-225-167-77.compute-1.amazonaws.com:5432/d2u2ls60ekirmm",
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// pool.query(`select * from user_i`, (res, err) => {
//   console.log(res);
//   console.log(err);
// });

module.exports = { pool, redisClient };
