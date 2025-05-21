import { Note } from '../../../shared/types';
import { NoteRepository } from '../repositories/noteRepository';

export class NoteService {
  constructor(private noteRepo: NoteRepository) {}

  private hydrateNote(note: Note | null): Note | null {
    if (!note) return note;
    
    // Parse metadata if it's a string
    if (typeof note.metadata === 'string') {
      note.metadata = JSON.parse(note.metadata);
    }
    // Parse terms if it's a string
    if (typeof note.terms === 'string') {
      note.terms = JSON.parse(note.terms);
    }
    
    return note;
  }

  async createNote(note: Omit<Note, 'id' | 'created_at' | 'updated_at' | 'current_version_id'>): Promise<Note | null> {
    await this.noteRepo.createNote({
      ...note,
      terms: JSON.stringify(note.terms || {}),
      metadata: JSON.stringify(note.metadata || {}),
      deleted_at: null
    });

    const createdNote = await this.noteRepo.getNoteByNoteId(note.note_id);
    return this.hydrateNote(createdNote);
  }

  async getNoteByNoteId(noteId: string): Promise<Note | null> {
    const note = await this.noteRepo.getNoteByNoteId(noteId);
    return this.hydrateNote(note);
  }
}