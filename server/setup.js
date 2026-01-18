// Setup datatabase and other initial configurations
import mysql from "mysql2/promise";
import fs from "fs";

async function setupDB() {
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        multipleStatements: true
    });

    const schema = fs.readFileSync("./db.sql", "utf8");
    const seed = fs.readFileSync("./seed.sql", "utf8");

    await connection.query(schema);
    console.log("✅ Database schema created");

    await connection.query(seed);
    console.log("✅ Dummy data inserted");

    await connection.end();
}

setupDB().catch(console.error);