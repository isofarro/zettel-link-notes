import { Note } from '../../../shared/types';
import { NoteRepository } from '../repositories/noteRepository';

export class NoteService {
  constructor(private noteRepo: NoteRepository) {}

  async createNote(note: Omit<Note, 'id' | 'created_at' | 'updated_at'>): Promise<Note | null> {
    const noteId = await this.noteRepo.createNote({
      ...note,
      deleted_at: null
    });

    // Create initial revision
    const noteForRevision = { ...note, id: noteId, revision_number: note.revision_id } as Note & { revision_number: number };
    await this.noteRepo.createNoteRevision(noteId, noteForRevision);

    return this.noteRepo.getNoteByZettelId(note.zettel_id);
  }

  async getNoteByZettelId(zettelId: string): Promise<Note | null> {
    return this.noteRepo.getNoteByZettelId(zettelId);
  }
}