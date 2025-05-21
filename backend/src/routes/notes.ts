import { Server, Request, Response } from 'restify';
import { NoteRepository } from '../repositories/noteRepository';
import { NoteService } from '../services/noteService';
import { db } from '../db';

const noteRepo = new NoteRepository(db);
const noteService = new NoteService(noteRepo);

export function notesRoutes(server: Server) {
  server.post('/notes', async (req: Request, res: Response) => {
    try {
      const { note_id, title, content, terms, metadata } = req.body;
      
      const note = await noteService.createNote({
        note_id,
        title,
        content,
        terms,
        metadata,
        deleted_at: null
      });

      if (!note) {
        res.send(500, { error: 'Failed to create note' });
        return;
      }
      res.send(201, note);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred';
      res.send(500, { error });
    }
  });

  server.get('/notes/:noteId', async (req: Request, res: Response) => {
    try {
      const note = await noteService.getNoteByNoteId(req.params.noteId);
      if (!note) {
        res.send(404, { error: 'Note not found' });
        return;
      }
      res.send(200, note);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred';
      res.send(500, { error });
    }
  });
}