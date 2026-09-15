// Dev-only migration runner. Usage: node --env-file=.env scripts/migrate.mjs
// Applies every .sql file under supabase/migrations in filename order.
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "supabase", "migrations");

const connectionString = process.env.SUPABASE_DB_URL;
if (!connectionString) {
  console.error("SUPABASE_DB_URL is not set. Run with: node --env-file=.env scripts/migrate.mjs");
  process.exit(1);
}

const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });

const files = readdirSync(dir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

try {
  await client.connect();
  for (const file of files) {
    const sql = readFileSync(join(dir, file), "utf8");
    process.stdout.write(`Applying ${file}... `);
    await client.query(sql);
    console.log("ok");
  }
  console.log(`Done: ${files.length} migration(s) applied.`);
} catch (err) {
  console.error("Migration failed:", err.message);
  process.exit(1);
} finally {
  await client.end();
}
