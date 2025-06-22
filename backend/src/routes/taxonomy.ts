import { Server, Request, Response } from 'restify';
import { TaxonomyRepository } from '../repositories/taxonomyRepository';
import { vaultManager } from '../db';

const taxonomyRepo = new TaxonomyRepository(vaultManager);

export function taxonomyRoutes(server: Server) {
  server.post('/:vault/taxonomies', async (req: Request, res: Response) => {
    try {
      const { vault } = req.params;
      const { name, description } = req.body;
      const slug = await taxonomyRepo.createSlug(vault, name);

      const taxonomyId = await taxonomyRepo.createTaxonomy(vault, {
        name,
        description,
        slug,
      });

      const taxonomy = await taxonomyRepo.getTaxonomyBySlug(vault, slug);
      res.send(201, taxonomy);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred';
      res.send(500, { error });
    }
  });

  server.get('/:vault/taxonomies', async (req: Request, res: Response) => {
    try {
      const { vault } = req.params;
      const taxonomies = await taxonomyRepo.listTaxonomies(vault);
      res.send(200, taxonomies);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred';
      res.send(500, { error });
    }
  });

  server.get('/:vault/taxonomies/:taxonomySlug', async (req: Request, res: Response) => {
    try {
      const { vault, taxonomySlug } = req.params;
      const taxonomy = await taxonomyRepo.getTaxonomyBySlug(vault, taxonomySlug);
      if (!taxonomy) {
        res.send(404, { error: 'Taxonomy not found' });
        return;
      }
      res.send(200, taxonomy);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred';
      res.send(500, { error });
    }
  });

  server.post('/:vault/taxonomies/:taxonomySlug/terms', async (req: Request, res: Response) => {
    try {
      const { vault, taxonomySlug } = req.params;
      const { name, description } = req.body;

      const taxonomy = await taxonomyRepo.getTaxonomyBySlug(vault, taxonomySlug);
      if (!taxonomy) {
        res.send(404, { error: 'Taxonomy not found' });
        return;
      }

      const slug = await taxonomyRepo.createSlug(vault, name);
      const termId = await taxonomyRepo.createTerm(vault, {
        taxonomy_id: taxonomy.id,
        name,
        description,
        slug,
      });

      const terms = await taxonomyRepo.listTerms(vault, taxonomy.id);
      const createdTerm = terms.find(term => term.id === termId);
      res.send(201, createdTerm);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred';
      res.send(500, { error });
    }
  });

  server.get('/:vault/taxonomies/:taxonomySlug/terms', async (req: Request, res: Response) => {
    try {
      const { vault, taxonomySlug } = req.params;
      const taxonomy = await taxonomyRepo.getTaxonomyBySlug(vault, taxonomySlug);
      if (!taxonomy) {
        res.send(404, { error: 'Taxonomy not found' });
        return;
      }

      const terms = await taxonomyRepo.listTerms(vault, taxonomy.id);
      res.send(200, terms);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred';
      res.send(500, { error });
    }
  });
}
