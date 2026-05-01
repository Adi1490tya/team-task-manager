const path = require('path');
const fs   = require('fs');
const initSqlJs = require('sql.js');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../data/taskmanager.db');
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

let _dbInstance = null;

const getDb = async () => {
  if (_dbInstance) return _dbInstance;

  const SQL = await initSqlJs();
  const buffer = fs.existsSync(dbPath) ? fs.readFileSync(dbPath) : null;
  const sqlDb  = new SQL.Database(buffer);

  const save = () => {
    const data = sqlDb.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
  };

  // Run schema once
  sqlDb.run(`PRAGMA foreign_keys = ON`);
  sqlDb.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin','member')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS project_members (
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      PRIMARY KEY (project_id, user_id)
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
      status TEXT NOT NULL DEFAULT 'todo' CHECK(status IN ('todo','in-progress','done')),
      due_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_tasks_project   ON tasks(project_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_assigned  ON tasks(assigned_to);
    CREATE INDEX IF NOT EXISTS idx_members_project ON project_members(project_id);
    CREATE INDEX IF NOT EXISTS idx_members_user    ON project_members(user_id);
  `);
  save();

  // Wrapper that mimics better-sqlite3 API
  const db = {
    prepare(sql) {
      return {
        run(...params) {
          sqlDb.run(sql, params);
          // ✅ FIXED: get lastInsertRowid from the SAME sqlDb instance immediately
          const res = sqlDb.exec('SELECT last_insert_rowid() as id');
          const lastInsertRowid = res[0]?.values[0][0] ?? null;
          save();
          return { lastInsertRowid };
        },
        get(...params) {
          const res = sqlDb.exec(sql, params);
          if (!res.length || !res[0].values.length) return undefined;
          const { columns, values } = res[0];
          return Object.fromEntries(columns.map((c, i) => [c, values[0][i]]));
        },
        all(...params) {
          const res = sqlDb.exec(sql, params);
          if (!res.length) return [];
          const { columns, values } = res[0];
          return values.map(row => Object.fromEntries(columns.map((c, i) => [c, row[i]])));
        },
      };
    },
    exec(sql) {
      sqlDb.run(sql);
      save();
      return this;
    },
  };

  console.log('✅ Database ready at ', dbPath);
  _dbInstance = db;
  return db;
};

module.exports = { getDb };
