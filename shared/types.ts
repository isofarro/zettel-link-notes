export interface Note {
  id: number;
  note_id: string;
  title: string;
  content: string;
  metadata: string; // JSON string
  terms: string;   // JSON string
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  current_version_id: number;
}

// Remove NoteMetadata and NoteTerm interfaces as they're no longer needed
export interface NoteVersion {
  id: number;
  note_id: number;
  title: string;
  content: string;
  created_at: string;
}

export interface NoteMetadata {
  id: number;
  note_id: number;
  key: string;
  value: string;
}

export interface NoteTerm {
  note_id: number;
  term_id: number;
}

export interface NoteReference {
  parent_note_id: number;
  child_note_id: number;
}

export interface Taxonomy {
  id: number;
  name: string;
  description: string;
  slug: string;
}

export interface TaxonomyTerm {
  id: number;
  taxonomy_id: number;
  name: string;
  description: string;
}