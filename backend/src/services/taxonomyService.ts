import { TaxonomyRepository } from '../repositories/taxonomyRepository';

export class TaxonomyService {
  constructor(private taxonomyRepo: TaxonomyRepository) {}

  async createTaxonomy(vaultName: string, name: string, description: string) {
    const slug = await this.taxonomyRepo.createSlug(vaultName, name);
    const taxonomyId = await this.taxonomyRepo.createTaxonomy(vaultName, {
      name,
      description,
      slug
    });
    return this.taxonomyRepo.getTaxonomyBySlug(vaultName, slug);
  }

  async listTaxonomies(vaultName: string) {
    return this.taxonomyRepo.listTaxonomies(vaultName);
  }

  async getTaxonomy(vaultName: string, taxonomySlug: string) {
    return this.taxonomyRepo.getTaxonomyBySlug(vaultName, taxonomySlug);
  }

  async createTerm(vaultName: string, taxonomyId: number, name: string, description: string) {
    const slug = await this.taxonomyRepo.createSlug(vaultName, name);
    const termId = await this.taxonomyRepo.createTerm(vaultName, {
      taxonomy_id: taxonomyId,
      name,
      description,
      slug
    });
    const terms = await this.listTerms(vaultName, taxonomyId);
    return terms.find(term => term.id === termId);
  }

  async listTerms(vaultName: string, taxonomyId: number) {
    return this.taxonomyRepo.listTerms(vaultName, taxonomyId);
  }
}