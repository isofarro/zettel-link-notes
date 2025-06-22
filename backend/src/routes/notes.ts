import { Server, Request, Response } from 'restify';
import { NoteRepository } from '../repositories/noteRepository';
import { NoteService } from '../services/noteService';
import { db } from '../db';

const noteRepo = new NoteRepository(db);
const noteService = new NoteService(noteRepo);

export function notesRoutes(server: Server) {
  server.post('/notes', async (req: Request, res: Response) => {
    try {
      const { zettel_id, title, content } = req.body;

      const note = await noteService.createNote({
        zettel_id,
        title,
        content,
        revision_id: 1,
        deleted_at: null,
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

  server.get('/notes/:zettelId', async (req: Request, res: Response) => {
    try {
      const note = await noteService.getNoteByZettelId(req.params.zettelId);
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

  server.put('/notes/:zettelId', async (req: Request, res: Response) => {
    try {
      const { title, content } = req.body;
      const note = await noteService.updateNote(req.params.zettelId, { title, content });

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
