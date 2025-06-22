import { Database } from 'sqlite3';
import { Note } from '../../../shared/types';
import { VaultManager } from '../db';

export class NoteRepository {
  constructor(private vaultManager: VaultManager) {}

  private async getDb(vaultName: string): Promise<Database> {
    return this.vaultManager.getVaultDb(vaultName);
  }

  async createNote(
    vaultName: string,
    note: Omit<Note, 'id' | 'created_at' | 'updated_at'>
  ): Promise<number> {
    const db = await this.getDb(vaultName);
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO notes (zettel_id, title, content, revision_id) VALUES (?, ?, ?, ?)',
        [note.zettel_id, note.title, note.content, note.revision_id],
        function (err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  async getNoteByZettelId(vaultName: string, zettelId: string): Promise<Note | null> {
    const db = await this.getDb(vaultName);
    return new Promise((resolve, reject) => {
      db.get(
        `
        SELECT 
          n.id,
          n.zettel_id,
          n.revision_id,
          n.title,
          n.content,
          n.created_at,
          n.updated_at,
          n.deleted_at
        FROM notes n
        WHERE n.zettel_id = ?
      `,
        [zettelId],
        (err, row: Note | null) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
  }

  async createNoteRevision(
    vaultName: string,
    noteId: number,
    note: Note & { revision_number: number }
  ): Promise<number> {
    const db = await this.getDb(vaultName);
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO note_revisions (note_id, revision_number, zettel_id, title, content, valid_from)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
      `,
        [noteId, note.revision_number, note.zettel_id, note.title, note.content],
        function (err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  async listNotes(
    vaultName: string
  ): Promise<Array<Omit<Note, 'id' | 'revision_id' | 'content' | 'updated_at' | 'deleted_at'>>> {
    const db = await this.getDb(vaultName);
    return new Promise((resolve, reject) => {
      db.all(
        `
        SELECT zettel_id, title, created_at
        FROM notes
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
        `,
        [],
        (
          err,
          rows: Array<
            Omit<Note, 'id' | 'revision_id' | 'content' | 'updated_at' | 'deleted_at'>
          > | null
        ) => {
          if (err) reject(err);
          resolve(rows || []);
        }
      );
    });
  }

  async updateNote(vaultName: string, note: Note): Promise<boolean> {
    const db = await this.getDb(vaultName);
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE notes SET title = ?, content = ?, revision_id = ?, updated_at = datetime('now') WHERE zettel_id = ?",
        [note.title, note.content, note.revision_id, note.zettel_id],
        function (err) {
          if (err) reject(err);
          resolve(this.changes > 0);
        }
      );
    });
  }
}
