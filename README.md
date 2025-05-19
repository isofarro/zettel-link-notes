# Zettel link notes

A web-app for creating and linking notes. The storage is an SQLite database.

The backend is a node.js with Restify. The frontend is a React app. Both frontend and backend are written in TypeScript.

This repository is a mono-repository. The backend is in the `backend` directory, the frontend is in the `frontend` directory. They share a common `shared` directory, which includes the TypeScript types shared.

## Key features

Create and edit notes, linking notes together. A note is aware of what it links to and what links to it. Notes are searchable by text search, and by it's associated tags and metadata. Notes have a created and updated date. Notes, and their metadata are versioned, the app tracks the history of notes, their links, and tags.

A note is a markdown file with frontmatter. The frontmatter is a yaml block at the top of the file. The app supports custom taxonomies that can be created on the fly by adding it to the  note's frontmatter.
