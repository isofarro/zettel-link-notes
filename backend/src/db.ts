import * as sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import * as path from 'path';
import * as fs from 'fs';

export class VaultManager {
  private vaultConnections: Map<string, Database> = new Map();
  private readonly dataDir: string;

  constructor() {
    this.dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  async getVaultDb(vaultName: string): Promise<Database> {
    if (this.vaultConnections.has(vaultName)) {
      return this.vaultConnections.get(vaultName)!;
    }

    const vaultDir = path.join(this.dataDir, vaultName);
    if (!fs.existsSync(vaultDir)) {
      throw new Error(`Vault ${vaultName} does not exist`);
    }

    const dbPath = path.join(vaultDir, 'zettel.db');
    const isNewDb = !fs.existsSync(dbPath);

    // For new vaults, ensure the directory exists
    if (isNewDb) {
      fs.mkdirSync(vaultDir, { recursive: true });
    }

    const db = await new Promise<Database>((resolve, reject) => {
      const database = new Database(dbPath, err => {
        if (err) reject(err);
        else resolve(database);
      });
    });

    // Initialize schema for new databases
    if (isNewDb) {
      const schema = fs.readFileSync(path.join(__dirname, '../../schema.sql'), 'utf8');
      await new Promise<void>((resolve, reject) => {
        db.exec(schema, err => {
          if (err) reject(err);
          else resolve();
        });
      });
      console.log(`Initialized schema for vault: ${vaultName}`);
    }

    this.vaultConnections.set(vaultName, db);
    console.log(`Connected to vault: ${vaultName}`);
    return db;
  }

  async closeAll(): Promise<void> {
    const closePromises = Array.from(this.vaultConnections.values()).map(
      db =>
        new Promise<void>((resolve, reject) => {
          db.close(err => {
            if (err) reject(err);
            else resolve();
          });
        })
    );

    await Promise.all(closePromises);
    this.vaultConnections.clear();
  }
}

export const vaultManager = new VaultManager();
