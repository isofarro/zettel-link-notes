import * as fs from 'fs';
import * as path from 'path';
import { VaultManager } from '../db';
import { NoteService } from './noteService';
import { Note } from '../../../shared/types';

export interface VaultDetails {
  name: string;
  notes: Note[];
}

export interface VaultInfo {
  name: string;
  url: string;
}

export class VaultService {
  private readonly dataDir: string;

  constructor(
    private vaultManager: VaultManager,
    private noteService: NoteService
  ) {
    this.dataDir = path.join(__dirname, '../../../data');
  }

  async listVaults(): Promise<VaultInfo[]> {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }

    const vaults = fs
      .readdirSync(this.dataDir)
      .filter(item => fs.statSync(path.join(this.dataDir, item)).isDirectory())
      .map(vault => ({
        name: vault,
        url: `http://localhost:3000/${vault}`,
      }));

    return vaults;
  }

  async createVault(name: string): Promise<VaultInfo> {
    if (!name) {
      throw new Error('Vault name is required');
    }

    // Initialize the vault (this will create the directory and database)
    await this.vaultManager.getVaultDb(name);

    return {
      name,
      url: `http://localhost:3000/${name}`,
    };
  }

  async getVaultDetails(vaultName: string): Promise<VaultDetails> {
    const vaultPath = path.join(this.dataDir, vaultName);

    if (!fs.existsSync(vaultPath)) {
      throw new Error('Vault not found');
    }

    const notes = await this.noteService.listNotes(vaultName);
    return {
      name: vaultName,
      notes,
    };
  }
}
