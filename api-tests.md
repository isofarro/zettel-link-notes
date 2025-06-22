# API Tests for Zettel Link Notes

This document contains curl commands for testing the Zettel Link Notes API endpoints.

## Health Check

Test the API health:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"ok"}
```

## Taxonomy Operations

### Create a Taxonomy

Create a new taxonomy for organizing notes:
```bash
curl -X POST http://localhost:3000/taxonomies \
  -H "Content-Type: application/json" \
  -d '{"name": "Topics", "description": "Main topics for notes"}'
```

Expected response will include the created taxonomy with an ID, name, description, and automatically generated slug:
```json
{
  "id": 1,
  "name": "Topics",
  "description": "Main topics for notes",
  "slug": "topics"
}
```

### List All Taxonomies

Get all available taxonomies:
```bash
curl http://localhost:3000/taxonomies
```

### Create a Term

Add a term to a taxonomy (using taxonomy slug 'topics'):
```bash
curl -X POST http://localhost:3000/taxonomies/topics/terms \
  -H "Content-Type: application/json" \
  -d '{"slug": "programming", "name": "Programming", "description": "Programming related notes"}'
```

### List Terms

Get all terms for a taxonomy:
```bash
curl http://localhost:3000/taxonomies/topics/terms
```

## Notes Operations

### Create a Note

Create a new note:
```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{
    "zettel_id": "202403141200",
    "title": "First Note",
    "content": "---\ntitle: First Note\ndate: 2024-03-14\n---\n\nThis is my first note with front matter."
  }'
```

### Get a Note

Retrieve a note by its zettel ID:
```bash
curl http://localhost:3000/notes/202403141200
```

Expected response will include:
```json
{
  "id": 1,
  "zettel_id": "202403141200",
  "revision_id": 1,
  "title": "First Note",
  "content": "---\ntitle: First Note\ndate: 2024-03-14\n---\n\nThis is my first note with front matter.",
  "created_at": "2024-03-14T12:00:00.000Z",
  "updated_at": "2024-03-14T12:00:00.000Z",
  "deleted_at": null
}
```

## Testing Flow

1. Start the server:
   ```bash
   cd backend
   yarn dev
   ```

2. Test sequence:
   - First run the health check to ensure the API is running
   - Create a taxonomy (it will get ID 1)
   - Create some terms in that taxonomy
   - Create a note with front matter
   - Retrieve the note to verify it was saved correctly

## Response Status Codes

- 200: Successful GET request
- 201: Successful POST request (resource created)
- 404: Resource not found
- 500: Server error

## Notes

- The server runs on port 3000 by default
- All POST requests must include the `Content-Type: application/json` header
- The database is automatically initialized when the server starts
- Notes use a zettel ID format (typically timestamp-based) for identification
- Content includes front matter in YAML format at the top of the markdown
- Revisions are automatically tracked when notes are updated