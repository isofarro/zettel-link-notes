import { Note, Taxonomy, TaxonomyTerm } from '../types';

const API_BASE = '/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Vault endpoints
  async getVaults() {
    return this.request<Array<{ name: string; url: string }>>('/');
  }

  async createVault(name: string) {
    return this.request<{ name: string; url: string }>('/', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async getVaultDetails(vaultName: string) {
    return this.request<{ name: string; notes: Note[] }>(`/${vaultName}`);
  }

  // Note endpoints
  async createNote(
    vaultName: string,
    note: { title: string; content: string }
  ) {
    // Generate a timestamp-based zettel_id
    const now = new Date();
    const zettel_id = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0');

    return this.request<Note>(`/${vaultName}/notes`, {
      method: 'POST',
      body: JSON.stringify({
        ...note,
        zettel_id,
      }),
    });
  }

  async getNote(vaultName: string, zettelId: string) {
    return this.request<Note>(`/${vaultName}/notes/${zettelId}`);
  }

  async updateNote(
    vaultName: string,
    zettelId: string,
    note: { title: string; content: string }
  ) {
    return this.request<Note>(`/${vaultName}/notes/${zettelId}`, {
      method: 'PUT',
      body: JSON.stringify(note),
    });
  }

  // Taxonomy endpoints (vault-scoped)
  async getTaxonomies(vaultName: string) {
    return this.request<Taxonomy[]>(`/${vaultName}/taxonomies`);
  }

  async createTaxonomy(
    vaultName: string,
    taxonomy: { name: string; description?: string }
  ) {
    return this.request<Taxonomy>(`/${vaultName}/taxonomies`, {
      method: 'POST',
      body: JSON.stringify(taxonomy),
    });
  }

  async getTaxonomy(vaultName: string, slug: string) {
    return this.request<Taxonomy>(`/${vaultName}/taxonomies/${slug}`);
  }

  async getTaxonomyTerms(vaultName: string, taxonomySlug: string) {
    return this.request<TaxonomyTerm[]>(
      `/${vaultName}/taxonomies/${taxonomySlug}/terms`
    );
  }

  async createTaxonomyTerm(
    vaultName: string,
    taxonomySlug: string,
    term: { name: string; description?: string }
  ) {
    return this.request<TaxonomyTerm>(
      `/${vaultName}/taxonomies/${taxonomySlug}/terms`,
      {
        method: 'POST',
        body: JSON.stringify(term),
      }
    );
  }
}

export const apiService = new ApiService();
