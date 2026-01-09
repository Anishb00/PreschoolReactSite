// run-proc.js
// Usage: node run-proc.js
// Requires: npm i mysql2 dotenv

import dotenv from "dotenv";
dotenv.config({path : "../../.env"});
import mysql from "mysql2/promise";

const CONFIG = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
};

function logMySqlError(label, err) {
  console.log(`\n=== ${label} ===`);
  console.dir(err, { depth: null, colors: true });
}

async function main() {
  const conn = await mysql.createConnection(CONFIG);

  const params = [
    "Emily Johnson",     // p_child_name
    "2021-05-14",        // p_dob
    "female",            // p_sex
    "Dr. Patel",         // p_doctor_name
    "14085551234",        // p_doctor_phone
    "Caterpillar",       // p_program
    "Parent One",        // p_parent1_name
    "123 Maple St",      // p_parent1_address
    "14085552222",        // p_parent1_phone
    "p1@example.com",    // p_parent1_email
    "Parent Two",        // p_parent2_name
    "123 Maple St",      // p_parent2_address
    "14085553333",        // p_parent2_phone
    "p2@example.com",    // p_parent2_email
  ];

    // const params = [
    // "Test Williams",     // p_child_name
    // "testdate",         // p_dob
    // "male",               // p_sex
    // "Dr. Smith",          // p_doctor_name
    // "14085554444",        // p_doctor_phone
    // "Butterfly",          // p_program
    // "Parent One",         // p_parent1_name
    // "123 Maple St",       // p_parent1_address
    // "14085552222",        // p_parent1_phone
    // "p1@example.com",     // p_parent1_email
    // "Parent Two",         // p_parent2_name
    // "123 Maple St",       // p_parent2_address
    // "14085553333",        // p_parent2_phone
    // "p2@example.com",     // p_parent2_email
    // ];



  const sql = "CALL register_child_waitlist(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

  try {
    console.log("Calling procedure with params:", params);
    const [rows] = await conn.execute(sql, params);

    console.log("\n=== Procedure call result ===");
    console.dir(rows, { depth: 4, colors: true });
  } catch (err) {
    logMySqlError("Procedure error", err);
    console.log("--------------------")
    console.log(typeof(err));
  } finally {
    await conn.end();
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
