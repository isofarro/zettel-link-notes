import * as restify from 'restify';
import { VaultService } from '../services/vaultService';

export function vaultRoutes(
  server: restify.Server,
  vaultService: VaultService
) {

  // List available vaults
  server.get(
    { path: '/', name: 'listVaults' },
    async (req: restify.Request, res: restify.Response) => {
      try {
        const vaults = await vaultService.listVaults();
        res.send(200, vaults);
      } catch (error: unknown) {
        if (error instanceof Error) {
          res.send(500, { error: 'Failed to list vaults' });
          throw error;
        }
        res.send(500, { error: 'An unexpected error occurred' });
        throw new Error('Unknown error occurred');
      }
    }
  );

  // Create a new vault
  server.post(
    { path: '/', name: 'createVault' },
    async (req: restify.Request, res: restify.Response) => {
      try {
        const { name } = req.body;
        if (!name) {
          res.send(400, { error: 'Vault name is required' });
          return;
        }

        const vault = await vaultService.createVault(name);
        res.send(201, vault);
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.message === 'Vault name is required') {
            res.send(400, { error: error.message });
          } else {
            res.send(500, { error: 'Failed to create vault' });
          }
          throw error;
        }
        res.send(500, { error: 'An unexpected error occurred' });
        throw new Error('Unknown error occurred');
      }
    }
  );

  // Get vault details including notes
  server.get(
    { path: '/:vault', name: 'getVaultDetails' },
    async (req: restify.Request, res: restify.Response) => {
      try {
        const vault = await vaultService.getVaultDetails(req.params.vault);
        res.send(200, vault);
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.message === 'Vault not found') {
            res.send(404, { error: error.message });
          } else {
            res.send(500, { error: 'Failed to get vault details' });
          }
          throw error;
        }
        res.send(500, { error: 'An unexpected error occurred' });
        throw new Error('Unknown error occurred');
      }
    }
  );
}
