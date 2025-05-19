import { Database } from 'sqlite3';
import { Taxonomy, TaxonomyTerm } from '../../../shared/types';

export class TaxonomyRepository {
  constructor(private db: Database) {}

  async createTaxonomy(taxonomy: Omit<Taxonomy, 'id'>): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO taxonomies (name, description) VALUES (?, ?)',
        [taxonomy.name, taxonomy.description],
        function(err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  async createTerm(term: Omit<TaxonomyTerm, 'id'>): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO taxonomy_terms (taxonomy_id, name, description) VALUES (?, ?, ?)',
        [term.taxonomy_id, term.name, term.description],
        function(err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  async getTaxonomies(): Promise<Taxonomy[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM taxonomies', (err, rows: Taxonomy[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  async getTermsByTaxonomyId(taxonomyId: number): Promise<TaxonomyTerm[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM taxonomy_terms WHERE taxonomy_id = ?',
        [taxonomyId],
        (err, rows: TaxonomyTerm[]) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }
}