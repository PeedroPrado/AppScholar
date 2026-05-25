import { Client } from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

async function initDatabase() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "postgres",
  });

  try {
    await client.connect();

    const checkDb = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'app_scholar'"
    );

    if (checkDb.rowCount === 0) {
      await client.query("CREATE DATABASE app_scholar");
      console.log("Banco criado");
    } else {
      console.log("Banco já existe");
    }

    await client.end();

    const dbClient = new Client({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "app_scholar",
    });

    await dbClient.connect();

    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    await dbClient.query(schema);

    console.log("Tabelas criadas");

    await dbClient.end();

  } catch (error) {
    console.log(error);
  }
}

initDatabase();