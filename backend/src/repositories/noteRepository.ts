import { Database } from 'sqlite3';
import { Note } from '../../../shared/types';

export class NoteRepository {
  constructor(private db: Database) {}

  async createNote(note: Omit<Note, 'id' | 'created_at' | 'updated_at' | 'current_version_id'>): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO notes (note_id, title, content, metadata, terms) VALUES (?, ?, ?, ?, ?)',
        [
          note.note_id, 
          note.title, 
          note.content,
          JSON.stringify(note.metadata || {}),
          JSON.stringify(note.terms || [])
        ],
        function(err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  async getNoteByNoteId(noteId: string): Promise<(Note & { terms: Record<string, string[]> }) | null> {
    return new Promise((resolve, reject) => {
      this.db.get(`
        SELECT 
          n.id,
          n.note_id,
          n.title,
          n.content,
          n.metadata,
          n.terms,
          n.created_at,
          n.updated_at,
          n.deleted_at,
          n.current_version_id
        FROM notes n
        WHERE n.note_id = ?
      `, [noteId], (err, row: any) => {
        if (err) reject(err);
        if (!row) {
          resolve(null);
          return;
        }

        // Create a clean base object without the fields we'll process
        const { metadata: metadataStr, terms: termsStr, ...baseNote } = row;
        
        try {
          // Parse metadata and terms into objects
          const metadata = typeof metadataStr === 'string' ? JSON.parse(metadataStr) : metadataStr || {};
          const terms = typeof termsStr === 'string' ? JSON.parse(termsStr) : termsStr || {};
          
          resolve({ 
            ...baseNote,
            metadata,
            terms
          });
        } catch (e) {
          console.error('Error parsing JSON:', e);
          resolve({
            ...baseNote,
            metadata: {},
            terms: {}
          });
        }
      });
    });
  }

  async createNoteVersion(noteId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(`
        INSERT INTO note_versions (note_id, title, content, metadata, terms)
        SELECT id, title, content, metadata, terms FROM notes WHERE id = ?
      `, [noteId], function(err) {
        if (err) reject(err);
        resolve(this.lastID);
      });
    });
  }
}