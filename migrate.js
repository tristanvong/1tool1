const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const createMigrationsTableIfNeeded = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      migration_name VARCHAR(255) UNIQUE NOT NULL,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  return new Promise((resolve, reject) => {
    pool.query(createTableQuery, (err, result) => {
      if (err) {
        reject(err);
      } else {
        console.log('Migrations table checked/created');
        resolve(result);
      }
    });
  });
};

const dropAllTables = () => {
  const dropTablesQuery = 'SHOW TABLES';
  return new Promise((resolve, reject) => {
    pool.query(dropTablesQuery, (err, tables) => {
      if (err) {
        reject(err);
      } else {
        const dropPromises = tables.map((table) => {
          const tableName = table['Tables_in_' + process.env.DB_NAME];
          const dropQuery = `DROP TABLE IF EXISTS \`${tableName}\``;
          return new Promise((resolve, reject) => {
            pool.query(dropQuery, (dropErr) => {
              if (dropErr) {
                reject(dropErr);
              } else {
                console.log(`Dropped table: ${tableName}`);
                resolve();
              }
            });
          });
        });

        Promise.all(dropPromises)
          .then(() => resolve())
          .catch((dropErr) => reject(dropErr));
      }
    });
  });
};

const runMigration = (query) => {
  return new Promise((resolve, reject) => {
    pool.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const checkIfMigrationExists = (migrationName) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM migrations WHERE migration_name = ?', [migrationName], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length > 0);
      }
    });
  });
};

const markMigrationAsExecuted = (migrationName) => {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO migrations (migration_name) VALUES (?)', [migrationName], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const migrate = async () => {
  const args = process.argv.slice(2);
  const isFresh = args.includes('--fresh') || args.includes('-f');

  try {
    if (isFresh) {
      console.log('Dropping all tables...');
      await dropAllTables();  
      console.log('Re-running migrations...');
    }

    await createMigrationsTableIfNeeded();

    const migrationFolder = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationFolder).filter((file) => file.endsWith('.sql'));

    for (const file of files) {
      const migrationName = file;
      const migrationQuery = fs.readFileSync(path.join(migrationFolder, file), 'utf-8');

      const migrationExists = await checkIfMigrationExists(migrationName);
      if (migrationExists) {
        console.log(`Migration ${migrationName} has already been executed`);
        continue;
      }

      try {
        await runMigration(migrationQuery);
        await markMigrationAsExecuted(migrationName);
        console.log(`Migration ${migrationName} ran successfully`);
      } catch (err) {
        console.error(`Error running migration ${migrationName}:`, err);
      }
    }

    console.log('Migration process completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error during migration process:', err);
  }
};

migrate();