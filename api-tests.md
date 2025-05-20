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

Expected response will include the created taxonomy with an ID.

### List All Taxonomies

Get all available taxonomies:
```bash
curl http://localhost:3000/taxonomies
```

### Create a Term

Add a term to a taxonomy (using taxonomy ID 1):
```bash
curl -X POST http://localhost:3000/taxonomies/1/terms \
  -H "Content-Type: application/json" \
  -d '{"name": "Programming", "description": "Programming related notes"}'
```

### List Terms

Get all terms for a taxonomy:
```bash
curl http://localhost:3000/taxonomies/1/terms
```

## Notes Operations

### Create a Note

Create a new note with terms and metadata:
```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{
    "note_id": "note1",
    "title": "First Note",
    "content": "This is my first note",
    "terms": {
      "Topics": ["Programming"]
    },
    "metadata": {
      "author": "Mike",
      "category": "test"
    }
  }'
```

### Get a Note

Retrieve a note by its ID:
```bash
curl http://localhost:3000/notes/note1
```

Expected response will include:
```json
{
  "id": 1,
  "note_id": "note1",
  "title": "First Note",
  "content": "This is my first note",
  "terms": {
    "Topics": ["Programming"]
  },
  "metadata": {
    "author": "Mike",
    "category": "test"
  },
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
   - Create a note using those terms
   - Retrieve the note to verify all relationships are properly saved

## Response Status Codes

- 200: Successful GET request
- 201: Successful POST request (resource created)
- 404: Resource not found
- 500: Server error

## Notes

- The server runs on port 3000 by default
- All POST requests must include the `Content-Type: application/json` header
- The database is automatically initialized when the server starts
- Term IDs start from 1 and increment sequentially
- Metadata is stored as a JSON object directly in the notes table
- Terms are stored as an array of term IDs directly in the notes table