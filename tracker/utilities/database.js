const { Pool } = require("pg");
const redis = require("redis");
const redisClient = redis.createClient(6379);

const pool = new Pool({
  port: 5432 || process.env.PGDB_PORT,
  host: "localhost" || process.env.DB_HOST,
  user: "postgres" || process.env.PGUSER,
  password: "123" || process.env.PGDB_PASS,
  database: "transactionService" || process.env.MYSQL_DB,
});

module.exports = { pool, redisClient };
