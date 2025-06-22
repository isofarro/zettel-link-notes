import { Server, Request, Response } from 'restify';
import { NoteRepository } from '../repositories/noteRepository';
import { NoteService } from '../services/noteService';
import { vaultManager } from '../db';

const noteRepo = new NoteRepository(vaultManager);
const noteService = new NoteService(noteRepo);

export function notesRoutes(server: Server) {
  server.post('/:vault/notes', async (req: Request, res: Response) => {
    try {
      const { vault } = req.params;
      const { zettel_id, title, content } = req.body;

      const note = await noteService.createNote(vault, {
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

  server.get('/:vault/notes/:zettelId', async (req: Request, res: Response) => {
    try {
      const { vault, zettelId } = req.params;
      const note = await noteService.getNoteByZettelId(vault, zettelId);
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

  server.put('/:vault/notes/:zettelId', async (req: Request, res: Response) => {
    try {
      const { vault, zettelId } = req.params;
      const { title, content } = req.body;
      const note = await noteService.updateNote(vault, zettelId, { title, content });

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
