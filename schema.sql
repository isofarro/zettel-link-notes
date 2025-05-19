-- Taxonomy and tags (unchanged):
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

-- Notes with version tracking:
CREATE TABLE notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    note_id TEXT NOT NULL, -- for folgelzettel
    current_version_id INTEGER NOT NULL DEFAULT 1,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    deleted_at TEXT DEFAULT NULL
);

-- Original relationship tables (unchanged):
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

-- New history tables:
CREATE TABLE note_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    note_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
);

CREATE TABLE note_terms_versions (
    version_id INTEGER NOT NULL,
    term_id INTEGER NOT NULL,
    FOREIGN KEY (version_id) REFERENCES note_versions(id) ON DELETE CASCADE,
    FOREIGN KEY (term_id) REFERENCES taxonomy_terms(id) ON DELETE CASCADE,
    UNIQUE (version_id, term_id)
);

CREATE TABLE note_metadata_versions (
    version_id INTEGER NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    FOREIGN KEY (version_id) REFERENCES note_versions(id) ON DELETE CASCADE
);

CREATE TABLE note_references_versions (
    version_id INTEGER NOT NULL,
    parent_note_id INTEGER NOT NULL,
    child_note_id INTEGER NOT NULL,
    FOREIGN KEY (version_id) REFERENCES note_versions(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (child_note_id) REFERENCES notes(id) ON DELETE CASCADE
);
