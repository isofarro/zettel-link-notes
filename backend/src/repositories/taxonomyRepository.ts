import { Database } from 'sqlite3';
import { Taxonomy, TaxonomyTerm } from '../../../shared/types';

export class TaxonomyRepository {
  constructor(private db: Database) {}

  public createSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async createTaxonomy(taxonomy: Omit<Taxonomy, 'id' | 'slug'>): Promise<number> {
    const slug = this.createSlug(taxonomy.name);
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO taxonomies (name, description, slug) VALUES (?, ?, ?)',
        [taxonomy.name, taxonomy.description, slug],
        function (err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  async getTaxonomyBySlug(slug: string): Promise<Taxonomy | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM taxonomies WHERE slug = ?',
        [slug],
        (err, row: Taxonomy | undefined) => {
          if (err) reject(err);
          resolve(row || null);
        }
      );
    });
  }

  async createTerm(term: Omit<TaxonomyTerm, 'id'>): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO taxonomy_terms (taxonomy_id, name, description, slug) VALUES (?, ?, ?, ?)',
        [term.taxonomy_id, term.name, term.description, term.slug],
        function (err) {
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

  async getTermsByTaxonomySlug(slug: string): Promise<TaxonomyTerm[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT tt.* FROM taxonomy_terms tt JOIN taxonomies t ON tt.taxonomy_id = t.id WHERE t.slug = ?',
        [slug],
        (err, rows: TaxonomyTerm[]) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }
}
