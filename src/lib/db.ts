import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "eventmanager",
  password: process.env.PASSWORD,
  port: 5432, // Default PostgreSQL port
});

export default pool;
