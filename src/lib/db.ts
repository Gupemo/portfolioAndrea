import mysql from 'mysql2/promise'

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof mysql.createPool>;
};

export const db =
  globalForDb.db ??
    mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT ?? "3306", 10),
      connectionLimit: 10,
    });

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}
