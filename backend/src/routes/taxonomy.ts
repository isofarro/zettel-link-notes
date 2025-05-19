import { Server, Request, Response } from 'restify';
import { TaxonomyRepository } from '../repositories/taxonomyRepository';
import { db } from '../db';

const taxonomyRepo = new TaxonomyRepository(db);

export function taxonomyRoutes(server: Server) {
  server.post('/taxonomies', async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
      const id = await taxonomyRepo.createTaxonomy({ name, description });
      res.send(201, { id, name, description });
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

  server.post('/taxonomies/:taxonomyId/terms', async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
      const taxonomy_id = parseInt(req.params.taxonomyId);
      const id = await taxonomyRepo.createTerm({ taxonomy_id, name, description });
      res.send(201, { id, taxonomy_id, name, description });
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred';
      res.send(500, { error });
    }
  });

  server.get('/taxonomies/:taxonomyId/terms', async (req: Request, res: Response) => {
    try {
      const terms = await taxonomyRepo.getTermsByTaxonomyId(parseInt(req.params.taxonomyId));
      res.send(200, terms);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred';
      res.send(500, { error });
    }
  });
}