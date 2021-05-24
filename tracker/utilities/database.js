const { Pool } = require("pg");
const redis = require("redis");

let redisClient;
let pool;
try {
  redisClient = redis.createClient(6379);

  pool = new Pool({
    port: 5432 || process.env.PGDB_PORT,
    host: "localhost" || process.env.DB_HOST,
    user: "postgres" || process.env.PGUSER,
    password: "123" || process.env.PGDB_PASS,
    database: "transactionService" || process.env.MYSQL_DB,
  });
} catch (err) {
  console.log(err);
}

module.exports = { pool, redisClient };
