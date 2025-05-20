import { Server, Request, Response, Next } from 'restify';
import { NoteRepository } from '../repositories/noteRepository';
import { db } from '../db';

const noteRepo = new NoteRepository(db);

export function notesRoutes(server: Server) {
  server.post('/notes', async (req: Request, res: Response) => {
    try {
      const { note_id, title, content, terms, metadata } = req.body;
      
      const noteId = await noteRepo.createNote({
        note_id,
        title,
        content,
        terms: JSON.stringify(terms || []),
        metadata: JSON.stringify(metadata || {}),
        deleted_at: null
      });

      // Get the created note
      const note = await noteRepo.getNoteByNoteId(note_id);
      if (note) {
        // Parse both metadata and terms if they're strings
        if (typeof note.metadata === 'string') {
          note.metadata = JSON.parse(note.metadata);
        }
        if (typeof note.terms === 'string') {
          note.terms = JSON.parse(note.terms);
        }
      }
      res.send(201, note);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred';
      res.send(500, { error });
    }
  });

  server.get('/notes/:noteId', async (req: Request, res: Response) => {
    try {
      const note = await noteRepo.getNoteByNoteId(req.params.noteId);
      if (!note) {
        res.send(404, { error: 'Note not found' });
        return;
      }
      // Parse both metadata and terms if they're strings
      if (typeof note.metadata === 'string') {
        note.metadata = JSON.parse(note.metadata);
      }
      if (typeof note.terms === 'string') {
        note.terms = JSON.parse(note.terms);
      }
      res.send(200, note);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred';
      res.send(500, { error });
    }
  });
}