import * as restify from 'restify';
import * as fs from 'fs';
import * as path from 'path';
import { VaultManager } from '../db';
import { NoteRepository } from '../repositories/noteRepository';

export function vaultRoutes(
  server: restify.Server,
  vaultManager: VaultManager,
  noteRepo: NoteRepository
) {
  // List available vaults
  server.get(
    { path: '/', name: 'listVaults' },
    async (req: restify.Request, res: restify.Response) => {
      try {
        const dataDir = path.join(__dirname, '../../../data');
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }

        const vaults = fs
          .readdirSync(dataDir)
          .filter(item => fs.statSync(path.join(dataDir, item)).isDirectory())
          .map(vault => ({
            name: vault,
            url: `http://localhost:3000/${vault}`,
          }));

        res.send(200, vaults);
      } catch (error) {
        res.send(500, { error: 'Failed to list vaults' });
        throw error;
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
        }

        // Initialize the vault (this will create the directory and database)
        await vaultManager.getVaultDb(name);

        res.send(201, {
          name,
          url: `http://localhost:3000/${name}`,
        });
      } catch (error) {
        res.send(500, { error: 'Failed to create vault' });
        throw error;
      }
    }
  );

  // Get vault details including notes
  server.get(
    { path: '/:vault', name: 'getVaultDetails' },
    async (req: restify.Request, res: restify.Response) => {
      try {
        const vault = req.params.vault;
        const dataDir = path.join(__dirname, '../../../data');
        const vaultPath = path.join(dataDir, vault);

        if (!fs.existsSync(vaultPath)) {
          res.send(404, { error: 'Vault not found' });
          return;
        }

        const notes = await noteRepo.listNotes(vault);
        res.send(200, {
          name: vault,
          notes,
        });
      } catch (error) {
        res.send(500, { error: 'Failed to get vault details' });
        throw error;
      }
    }
  );
}
