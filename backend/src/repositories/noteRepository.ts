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
          n.created_at,
          n.updated_at,
          n.deleted_at,
          n.current_version_id,
          GROUP_CONCAT(DISTINCT json_object(
            'taxonomy', tax.name,
            'term', tt.name
          )) as term_objects
        FROM notes n
        LEFT JOIN json_each(n.terms) terms ON 1=1
        LEFT JOIN taxonomy_terms tt ON tt.id = json_extract(terms.value, '$')
        LEFT JOIN taxonomies tax ON tax.id = tt.taxonomy_id
        WHERE n.note_id = ?
        GROUP BY n.id
      `, [noteId], (err, row: any) => {
        if (err) reject(err);
        if (!row) {
          resolve(null);
          return;
        }

        // Extract fields we need to process separately
        const { term_objects, metadata: metadataStr, ...baseNote } = row;
        
        // Parse metadata into an object
        const metadata = JSON.parse(metadataStr || '{}');
        
        // Process terms into taxonomy-grouped structure
        const termsByTaxonomy: Record<string, string[]> = {};
        if (term_objects) {
          const termObjects = term_objects.split(',').map((t: string) => {
            try {
              return JSON.parse(t.trim());
            } catch (e) {
              console.error('Failed to parse term object:', t);
              return null;
            }
          }).filter(Boolean);
          
          termObjects.forEach((t: { taxonomy: string; term: string }) => {
            if (!termsByTaxonomy[t.taxonomy]) {
              termsByTaxonomy[t.taxonomy] = [];
            }
            termsByTaxonomy[t.taxonomy].push(t.term);
          });
        }
        
        resolve({ 
          ...baseNote,
          metadata,  // Add the parsed metadata object
          terms: termsByTaxonomy
        });
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