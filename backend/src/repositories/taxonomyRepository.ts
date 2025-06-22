import { Database } from 'sqlite3';
import { Taxonomy, TaxonomyTerm } from '../../../shared/types';
import { VaultManager } from '../db';

export class TaxonomyRepository {
  constructor(private vaultManager: VaultManager) {}

  private async getDb(vaultName: string): Promise<Database> {
    return this.vaultManager.getVaultDb(vaultName);
  }

  async createTaxonomy(vaultName: string, taxonomy: Omit<Taxonomy, 'id'>): Promise<number> {
    const db = await this.getDb(vaultName);
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO taxonomies (name, description, slug) VALUES (?, ?, ?)',
        [taxonomy.name, taxonomy.description, taxonomy.slug],
        function (err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  async getTaxonomyBySlug(vaultName: string, slug: string): Promise<Taxonomy | null> {
    const db = await this.getDb(vaultName);
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM taxonomies WHERE slug = ?', [slug], (err, row: Taxonomy | null) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  async listTaxonomies(vaultName: string): Promise<Taxonomy[]> {
    const db = await this.getDb(vaultName);
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM taxonomies', (err, rows: Taxonomy[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  async createTerm(vaultName: string, term: Omit<TaxonomyTerm, 'id'>): Promise<number> {
    const db = await this.getDb(vaultName);
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO taxonomy_terms (taxonomy_id, name, description, slug) VALUES (?, ?, ?, ?)',
        [term.taxonomy_id, term.name, term.description, term.slug],
        function (err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  async listTerms(vaultName: string, taxonomyId: number): Promise<TaxonomyTerm[]> {
    const db = await this.getDb(vaultName);
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM taxonomy_terms WHERE taxonomy_id = ?',
        [taxonomyId],
        (err, rows: TaxonomyTerm[]) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }

  async createSlug(vaultName: string, name: string): Promise<string> {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const db = await this.getDb(vaultName);

    // Check if slug exists in taxonomies
    const existingTaxonomy = await new Promise<any>((resolve, reject) => {
      db.get('SELECT slug FROM taxonomies WHERE slug = ?', [slug], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    if (existingTaxonomy) {
      return `${slug}-${Date.now()}`;
    }

    return slug;
  }
}
