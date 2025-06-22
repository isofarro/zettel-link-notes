-- Taxonomy and terms (unchanged):
CREATE TABLE IF NOT EXISTS taxonomies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS taxonomy_terms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    taxonomy_id INTEGER NOT NULL,
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (taxonomy_id) REFERENCES taxonomies(id) ON DELETE CASCADE,
    UNIQUE (taxonomy_id, slug)
);

-- Notes with revision tracking
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zettel_id TEXT UNIQUE NOT NULL, -- for folgelzettel
    revision_id INTEGER NOT NULL DEFAULT 1, -- so we can create a new note
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATE DEFAULT (datetime('now')),
    updated_at DATE DEFAULT (datetime('now')),
    deleted_at DATE DEFAULT NULL
);

-- Version tracking table:
CREATE TABLE IF NOT EXISTS note_revisions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    note_id INTEGER NOT NULL,
    revision_number INTEGER NOT NULL,
    zettel_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    valid_from DATE NOT NULL DEFAULT (datetime('now')),
    valid_to DATE,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS note_references (
    parent_note_id INTEGER NOT NULL,
    child_note_id INTEGER NOT NULL,
    title TEXT,
    FOREIGN KEY (parent_note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (child_note_id) REFERENCES notes(id) ON DELETE CASCADE,
    UNIQUE (parent_note_id, child_note_id)
);
