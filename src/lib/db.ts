// Get the client
import mysql from 'mysql2/promise';



const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 5,   // good starting point for your case
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

(async () => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
})();

export default pool;






