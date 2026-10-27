/**
 * Cloud Database Import Utility for TravelHub
 * Imports local MySQL database_dump.sql into remote Cloud MySQL (Aiven, Railway, TiDB, etc.)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const mysql = require('mysql2/promise');

async function main() {
  const targetUrl = process.argv[2] || process.env.TARGET_DATABASE_URL;
  if (!targetUrl) {
    console.error('Usage: node import-cloud-db.js "mysql://user:password@host:port/dbname"');
    process.exit(1);
  }

  console.log('Connecting to target cloud database...');
  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch (e) {
    console.error('Invalid DATABASE_URL format:', e.message);
    process.exit(1);
  }

  const host = parsed.hostname;
  const port = parseInt(parsed.port || '3306', 10);
  const user = decodeURIComponent(parsed.username);
  const password = decodeURIComponent(parsed.password);
  const database = parsed.pathname.replace(/^\//, '');

  console.log(`Host: ${host}:${port}, User: ${user}, Database: ${database}`);

  const dumpPath = path.join(__dirname, '..', 'database_dump.sql');
  if (!fs.existsSync(dumpPath)) {
    console.error('Dump file not found at:', dumpPath);
    process.exit(1);
  }

  const mysqlExe = 'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe';
  if (fs.existsSync(mysqlExe)) {
    console.log('Using native mysql.exe client for high-speed import...');
    try {
      const sslFlag = targetUrl.includes('ssl-mode') || host.includes('aiven') ? '--ssl-mode=REQUIRED' : '';
      const cmd = `& "${mysqlExe}" -h "${host}" -P ${port} -u "${user}" -p"${password}" ${sslFlag} "${database}" < "${dumpPath}"`;
      execSync(`powershell -Command "${cmd}"`, { stdio: 'inherit' });
      console.log('Database import completed successfully via mysql.exe!');
      return;
    } catch (err) {
      console.warn('Native mysql.exe import encountered an error, falling back to mysql2 JS engine...', err.message);
    }
  }

  // Fallback to mysql2
  console.log('Importing via mysql2 engine...');
  const conn = await mysql.createConnection({
    host,
    port,
    user,
    password,
    database,
    multipleStatements: true,
    ssl: { rejectUnauthorized: false }
  });

  console.log('Connected! Reading SQL dump...');
  const sqlContent = fs.readFileSync(dumpPath, 'utf8');
  await conn.query(sqlContent);
  await conn.end();
  console.log('Database import completed successfully via mysql2!');
}

main().catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});
