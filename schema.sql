-- Taxonomy and tags (unchanged):
CREATE TABLE IF NOT EXISTS taxonomies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS taxonomy_terms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    taxonomy_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (taxonomy_id) REFERENCES taxonomies(id) ON DELETE CASCADE
);

-- Notes with version tracking and JSON metadata:
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    note_id TEXT NOT NULL, -- for folgelzettel
    current_version_id INTEGER NOT NULL DEFAULT 1,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata TEXT NOT NULL DEFAULT '{}', -- JSON string for metadata
    terms TEXT NOT NULL DEFAULT '[]',    -- JSON string for term IDs
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    deleted_at TEXT DEFAULT NULL
);

-- Version tracking table:
CREATE TABLE IF NOT EXISTS note_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    note_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata TEXT NOT NULL,  -- JSON string for metadata
    terms TEXT NOT NULL,     -- JSON string for term IDs
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS note_references (
    parent_note_id INTEGER NOT NULL,
    child_note_id INTEGER NOT NULL,
    FOREIGN KEY (parent_note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (child_note_id) REFERENCES notes(id) ON DELETE CASCADE,
    UNIQUE (parent_note_id, child_note_id)
);
