import { Database } from 'sqlite3';
import { Note, NoteVersion, NoteMetadata, NoteTerm } from '../../../shared/types';

export class NoteRepository {
  constructor(private db: Database) {}

  async createNote(note: Omit<Note, 'id' | 'created_at' | 'updated_at' | 'current_version_id'>): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO notes (note_id, title, content) VALUES (?, ?, ?)',
        [note.note_id, note.title, note.content],
        function(err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  async addNoteTerms(noteId: number, termIds: number[]): Promise<void> {
    const stmt = this.db.prepare('INSERT INTO note_terms (note_id, term_id) VALUES (?, ?)');
    for (const termId of termIds) {
      await new Promise((resolve, reject) => {
        stmt.run([noteId, termId], (err) => {
          if (err) reject(err);
          resolve(null);
        });
      });
    }
    stmt.finalize();
  }

  async addNoteMetadata(noteId: number, metadata: { key: string, value: string }[]): Promise<void> {
    const stmt = this.db.prepare('INSERT INTO note_metadata (note_id, key, value) VALUES (?, ?, ?)');
    for (const item of metadata) {
      await new Promise((resolve, reject) => {
        stmt.run([noteId, item.key, item.value], (err) => {
          if (err) reject(err);
          resolve(null);
        });
      });
    }
    stmt.finalize();
  }

  async getNoteByNoteId(noteId: string): Promise<(Note & { tags: string[], metadata: Record<string, string> }) | null> {
    return new Promise((resolve, reject) => {
      this.db.get(`
        SELECT 
          n.*,
          GROUP_CONCAT(DISTINCT tt.name) as tags,
          GROUP_CONCAT(DISTINCT nm.key || ':' || nm.value) as metadata_str
        FROM notes n
        LEFT JOIN note_terms nt ON nt.note_id = n.id
        LEFT JOIN taxonomy_terms tt ON tt.id = nt.term_id
        LEFT JOIN note_metadata nm ON nm.note_id = n.id
        WHERE n.note_id = ?
        GROUP BY n.id
      `, [noteId], (err, row: any) => {
        if (err) reject(err);
        if (!row) resolve(null);
        
        const tags = row.tags ? row.tags.split(',') : [];
        const metadata = row.metadata_str ? 
          Object.fromEntries(
            row.metadata_str.split(',')
              .map((item: string) => item.split(':') as [string, string])
          ) : {};
        
        resolve({ ...row, tags, metadata });
      });
    });
  }

  async createNoteVersion(noteId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(`
        INSERT INTO note_versions (note_id, title, content)
        SELECT id, title, content FROM notes WHERE id = ?
      `, [noteId], function(err) {
        if (err) reject(err);
        resolve(this.lastID);
      });
    });
  }
}