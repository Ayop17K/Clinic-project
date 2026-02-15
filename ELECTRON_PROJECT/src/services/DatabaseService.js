const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');
const fs = require('fs');

class DatabaseService {
  constructor() {
    const dbDir = path.join(app.getPath('userData'), 'clinic-budget-db');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    const dbPath = path.join(dbDir, 'budget-app.db');
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.initDatabase();
  }

  initDatabase() {
    // Create tables if they don't exist
    const schema = `
      CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        category_name TEXT NOT NULL,
        budget_op REAL DEFAULT 0,
        budget_fund REAL DEFAULT 0,
        oct REAL DEFAULT 0,
        nov REAL DEFAULT 0,
        dec REAL DEFAULT 0,
        jan REAL DEFAULT 0,
        feb REAL DEFAULT 0,
        mar REAL DEFAULT 0,
        apr REAL DEFAULT 0,
        may REAL DEFAULT 0,
        jun REAL DEFAULT 0,
        jul REAL DEFAULT 0,
        aug REAL DEFAULT 0,
        sep REAL DEFAULT 0,
        total REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(year, category_id)
      );

      CREATE TABLE IF NOT EXISTS sub_budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        budget_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        budget_op REAL DEFAULT 0,
        budget_fund REAL DEFAULT 0,
        oct REAL DEFAULT 0,
        nov REAL DEFAULT 0,
        dec REAL DEFAULT 0,
        jan REAL DEFAULT 0,
        feb REAL DEFAULT 0,
        mar REAL DEFAULT 0,
        apr REAL DEFAULT 0,
        may REAL DEFAULT 0,
        jun REAL DEFAULT 0,
        jul REAL DEFAULT 0,
        aug REAL DEFAULT 0,
        sep REAL DEFAULT 0,
        total REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS plan_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year INTEGER NOT NULL,
        data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_budgets_year ON budgets(year);
      CREATE INDEX IF NOT EXISTS idx_sub_budgets_budget_id ON sub_budgets(budget_id);
      CREATE INDEX IF NOT EXISTS idx_plan_records_year ON plan_records(year);
    `;

    try {
      this.db.exec(schema);
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }

  // Budget CRUD Operations
  saveBudget(budget) {
    try {
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO budgets 
        (year, category_id, category_name, budget_op, budget_fund, oct, nov, dec, jan, feb, mar, apr, may, jun, jul, aug, sep, total)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      return stmt.run(
        budget.year,
        budget.category_id,
        budget.category_name,
        budget.budget_op,
        budget.budget_fund,
        budget.oct,
        budget.nov,
        budget.dec,
        budget.jan,
        budget.feb,
        budget.mar,
        budget.apr,
        budget.may,
        budget.jun,
        budget.jul,
        budget.aug,
        budget.sep,
        budget.total
      );
    } catch (error) {
      console.error('Save budget error:', error);
      throw error;
    }
  }

  getBudgetsByYear(year) {
    try {
      const stmt = this.db.prepare('SELECT * FROM budgets WHERE year = ? ORDER BY category_id');
      return stmt.all(year);
    } catch (error) {
      console.error('Get budgets error:', error);
      return [];
    }
  }

  deleteBudgetByYear(year) {
    try {
      const stmt = this.db.prepare('DELETE FROM budgets WHERE year = ?');
      return stmt.run(year);
    } catch (error) {
      console.error('Delete budget error:', error);
      throw error;
    }
  }

  // Sub-budget operations
  saveSubBudget(subBudget) {
    try {
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO sub_budgets 
        (budget_id, name, budget_op, budget_fund, oct, nov, dec, jan, feb, mar, apr, may, jun, jul, aug, sep, total)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      return stmt.run(
        subBudget.budget_id,
        subBudget.name,
        subBudget.budget_op,
        subBudget.budget_fund,
        subBudget.oct,
        subBudget.nov,
        subBudget.dec,
        subBudget.jan,
        subBudget.feb,
        subBudget.mar,
        subBudget.apr,
        subBudget.may,
        subBudget.jun,
        subBudget.jul,
        subBudget.aug,
        subBudget.sep,
        subBudget.total
      );
    } catch (error) {
      console.error('Save sub-budget error:', error);
      throw error;
    }
  }

  // Save all data in one transaction
  saveAllData(year, budgets, subBudgets) {
    try {
      const transaction = this.db.transaction(() => {
        // Delete existing data for this year
        this.deleteBudgetByYear(year);
        
        // Insert new data
        budgets.forEach(budget => {
          this.saveBudget(budget);
        });
        
        subBudgets.forEach(subBudget => {
          this.saveSubBudget(subBudget);
        });
      });

      return transaction();
    } catch (error) {
      console.error('Save all data error:', error);
      throw error;
    }
  }

  close() {
    try {
      this.db.close();
    } catch (error) {
      console.error('Database close error:', error);
    }
  }
}

module.exports = DatabaseService;
