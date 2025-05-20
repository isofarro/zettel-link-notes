import { Server, Request, Response } from 'restify';
import { TaxonomyRepository } from '../repositories/taxonomyRepository';
import { db } from '../db';

const taxonomyRepo = new TaxonomyRepository(db);

export function taxonomyRoutes(server: Server) {
  server.post('/taxonomies', async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
      const id = await taxonomyRepo.createTaxonomy({ name, description });
      const taxonomy = await taxonomyRepo.getTaxonomyBySlug(taxonomyRepo.createSlug(name));
      res.send(201, taxonomy); // This will include id, name, description, and slug
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred';
      res.send(500, { error });
    }
  });

  server.get('/taxonomies', async (req: Request, res: Response) => {
    try {
      const taxonomies = await taxonomyRepo.getTaxonomies();
      res.send(200, taxonomies);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred';
      res.send(500, { error });
    }
  });

  server.post('/taxonomies/:taxonomySlug/terms', async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
      const taxonomy = await taxonomyRepo.getTaxonomyBySlug(req.params.taxonomySlug);
      
      if (!taxonomy) {
        res.send(404, { error: 'Taxonomy not found' });
        return;
      }

      const id = await taxonomyRepo.createTerm({ 
        taxonomy_id: taxonomy.id, 
        name, 
        description 
      });
      
      res.send(201, { id, taxonomy_id: taxonomy.id, name, description });
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred';
      res.send(500, { error });
    }
  });

  server.get('/taxonomies/:taxonomySlug/terms', async (req: Request, res: Response) => {
    try {
      const terms = await taxonomyRepo.getTermsByTaxonomySlug(req.params.taxonomySlug);
      res.send(200, terms);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred';
      res.send(500, { error });
    }
  });
}