-- Taxonomy and tags:
CREATE TABLE taxonomies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE taxonomy_terms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    taxonomy_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (taxonomy_id) REFERENCES taxonomies(id) ON DELETE CASCADE
);

-- Notes:
CREATE TABLE notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    note_id TEXT NOT NULL, -- for folgelzettel
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE TABLE note_terms (
    note_id INTEGER NOT NULL,
    term_id INTEGER NOT NULL,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (term_id) REFERENCES taxonomy_terms(id) ON DELETE CASCADE,
    UNIQUE (note_id, term_id)
);

CREATE TABLE note_metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    note_id INTEGER NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
);

CREATE TABLE note_references (
    parent_note_id INTEGER NOT NULL,
    child_note_id INTEGER NOT NULL,
    FOREIGN KEY (parent_note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (child_note_id) REFERENCES notes(id) ON DELETE CASCADE,
    UNIQUE (parent_note_id, child_note_id)
);
