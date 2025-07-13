import { Note, Taxonomy, TaxonomyTerm } from '../types';

const API_BASE = 'http://localhost:5001';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
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
  async createNote(vaultName: string, note: { title: string; content: string }) {
    return this.request<Note>(`/${vaultName}/notes`, {
      method: 'POST',
      body: JSON.stringify(note),
    });
  }

  async getNote(vaultName: string, zettelId: string) {
    return this.request<Note>(`/${vaultName}/notes/${zettelId}`);
  }

  async updateNote(vaultName: string, zettelId: string, note: { title: string; content: string }) {
    return this.request<Note>(`/${vaultName}/notes/${zettelId}`, {
      method: 'PUT',
      body: JSON.stringify(note),
    });
  }

  // Taxonomy endpoints
  async getTaxonomies() {
    return this.request<Taxonomy[]>('/taxonomies');
  }

  async createTaxonomy(taxonomy: { name: string; description?: string }) {
    return this.request<Taxonomy>('/taxonomies', {
      method: 'POST',
      body: JSON.stringify(taxonomy),
    });
  }

  async getTaxonomy(slug: string) {
    return this.request<Taxonomy>(`/taxonomies/${slug}`);
  }

  async getTaxonomyTerms(taxonomySlug: string) {
    return this.request<TaxonomyTerm[]>(`/taxonomies/${taxonomySlug}/terms`);
  }

  async createTaxonomyTerm(taxonomySlug: string, term: { name: string; description?: string }) {
    return this.request<TaxonomyTerm>(`/taxonomies/${taxonomySlug}/terms`, {
      method: 'POST',
      body: JSON.stringify(term),
    });
  }
}

export const apiService = new ApiService();