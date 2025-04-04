import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  database: process.env.DBNAME,
  password: process.env.DBPASSWORD,
  port: 5432, // Default PostgreSQL port
});

export default pool;
