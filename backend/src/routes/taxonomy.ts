import { Server, Request, Response } from 'restify';
import { TaxonomyService } from '../services/taxonomyService';

export function taxonomyRoutes(server: Server, taxonomyService: TaxonomyService) {
  server.post(
    { path: '/:vault/taxonomies', name: 'createTaxonomy' },
    async (req: Request, res: Response) => {
      try {
        const { vault } = req.params;
        const { name, description } = req.body;
        const taxonomy = await taxonomyService.createTaxonomy(vault, name, description);
        res.send(201, taxonomy);
      } catch (err: unknown) {
        const error = err instanceof Error ? err.message : 'An unknown error occurred';
        res.send(500, { error });
      }
    }
  );

  server.get(
    { path: '/:vault/taxonomies', name: 'listTaxonomies' },
    async (req: Request, res: Response) => {
      try {
        const { vault } = req.params;
        const taxonomies = await taxonomyService.listTaxonomies(vault);
        res.send(200, taxonomies);
      } catch (err: unknown) {
        const error = err instanceof Error ? err.message : 'An unknown error occurred';
        res.send(500, { error });
      }
    }
  );

  server.get(
    { path: '/:vault/taxonomies/:taxonomySlug', name: 'getTaxonomy' },
    async (req: Request, res: Response) => {
      try {
        const { vault, taxonomySlug } = req.params;
        const taxonomy = await taxonomyService.getTaxonomy(vault, taxonomySlug);
        if (!taxonomy) {
          res.send(404, { error: 'Taxonomy not found' });
          return;
        }
        res.send(200, taxonomy);
      } catch (err: unknown) {
        const error = err instanceof Error ? err.message : 'An unknown error occurred';
        res.send(500, { error });
      }
    }
  );

  server.post('/:vault/taxonomies/:taxonomySlug/terms', async (req: Request, res: Response) => {
    try {
      const { vault, taxonomySlug } = req.params;
      const { name, description } = req.body;

      const taxonomy = await taxonomyService.getTaxonomy(vault, taxonomySlug);
      if (!taxonomy) {
        res.send(404, { error: 'Taxonomy not found' });
        return;
      }

      const createdTerm = await taxonomyService.createTerm(vault, taxonomy.id, name, description);
      res.send(201, createdTerm);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred';
      res.send(500, { error });
    }
  });

  server.get('/:vault/taxonomies/:taxonomySlug/terms', async (req: Request, res: Response) => {
    try {
      const { vault, taxonomySlug } = req.params;
      const taxonomy = await taxonomyService.getTaxonomy(vault, taxonomySlug);
      if (!taxonomy) {
        res.send(404, { error: 'Taxonomy not found' });
        return;
      }

      const terms = await taxonomyService.listTerms(vault, taxonomy.id);
      res.send(200, terms);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred';
      res.send(500, { error });
    }
  });
}
