import { Database } from 'sqlite3';
import { Note } from '../../../shared/types';

export class NoteRepository {
  constructor(private db: Database) {}

  async createNote(note: Omit<Note, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO notes (zettel_id, title, content, revision_id) VALUES (?, ?, ?, ?)',
        [
          note.zettel_id,
          note.title,
          note.content,
          note.revision_id
        ],
        function(err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  async getNoteByZettelId(zettelId: string): Promise<Note | null> {
    return new Promise((resolve, reject) => {
      this.db.get(`
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
      `, [zettelId], (err, row: Note | null) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  async createNoteRevision(noteId: number, note: Note & { revision_number: number }): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(`
        INSERT INTO note_revisions (note_id, revision_number, zettel_id, title, content, valid_from)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
      `, [noteId, note.revision_number, note.zettel_id, note.title, note.content], function(err) {
        if (err) reject(err);
        resolve(this.lastID);
      });
    });
  }

  async updateNote(note: Note): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE notes SET title = ?, content = ?, revision_id = ?, updated_at = datetime(\'now\') WHERE zettel_id = ?',
        [note.title, note.content, note.revision_id, note.zettel_id],
        function(err) {
          if (err) reject(err);
          resolve(this.changes > 0);
        }
      );
    });
  }
}