import { Note } from '../../../shared/types';
import { NoteRepository } from '../repositories/noteRepository';

export class NoteService {
  constructor(private noteRepo: NoteRepository) {}

  async createNote(
    vaultName: string,
    note: Omit<Note, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Note | null> {
    const noteId = await this.noteRepo.createNote(vaultName, {
      ...note,
      deleted_at: null,
    });

    // Create initial revision
    const noteForRevision = { ...note, id: noteId, revision_number: note.revision_id } as Note & {
      revision_number: number;
    };
    await this.noteRepo.createNoteRevision(vaultName, noteId, noteForRevision);

    return this.noteRepo.getNoteByZettelId(vaultName, note.zettel_id);
  }

  async getNoteByZettelId(vaultName: string, zettelId: string): Promise<Note | null> {
    return this.noteRepo.getNoteByZettelId(vaultName, zettelId);
  }

  async listNotes(vaultName: string): Promise<Note[]> {
    return this.noteRepo.listNotes(vaultName);
  }

  async updateNote(
    vaultName: string,
    zettelId: string,
    updates: Pick<Note, 'title' | 'content'>
  ): Promise<Note | null> {
    const existingNote = await this.getNoteByZettelId(vaultName, zettelId);
    if (!existingNote) return null;

    const updatedNote = {
      ...existingNote,
      ...updates,
      revision_id: existingNote.revision_id + 1,
    };

    const success = await this.noteRepo.updateNote(vaultName, updatedNote);
    if (!success) return null;

    // Create new revision
    const noteForRevision = { ...updatedNote, revision_number: updatedNote.revision_id } as Note & {
      revision_number: number;
    };
    await this.noteRepo.createNoteRevision(vaultName, existingNote.id, noteForRevision);

    return this.getNoteByZettelId(vaultName, zettelId);
  }
}
