export interface Note {
  id: number;
  zettel_id: string;
  revision_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface NoteRevision {
  id: number;
  note_id: number;
  revision_number: number;
  zettel_id: string;
  title: string;
  content: string;
  valid_from: string;
  valid_to: string | null;
}

export interface NoteReference {
  parent_note_id: number;
  child_note_id: number;
  title: string | null;
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
  slug: string;
}