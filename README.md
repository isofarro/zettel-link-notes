# Zettel link notes

A web-app for creating and linking notes. The storage is an SQLite database per vault.

![Zettel link notes screenshot](/public/zettel-link-notes.png)

## Key features

Create and edit notes, linking notes together using a Zettelkasten-inspired system. Each note has a unique zettel ID (typically timestamp-based) and maintains bidirectional links, so a note knows both what it links to and what links to it. Notes are searchable by text content and their links.

Notes are written in markdown with YAML front matter. The front matter contains metadata like title and date. The app maintains a complete revision history of each note, tracking changes to both content and title over time.

## Note Structure

A note consists of:
- A unique zettel ID
- Title
- Content (markdown with YAML front matter)
- Creation and update timestamps
- Revision tracking
- Bidirectional links to other notes

Example note content:
```markdown
---
title: My First Note
date: 2024-03-14
---

This is the content of my note.

It can link to [[202403141205]] another note.
```

## Data Storage

The app uses SQLite with the following key tables:
- `notes`: Stores current note data
- `note_revisions`: Tracks the complete history of note changes
- `note_references`: Maintains bidirectional links between notes
- `taxonomies` and `taxonomy_terms`: Supports custom taxonomies for organizing notes
