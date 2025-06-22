# API Tests for Zettel Link Notes

## Health Check
```bash
curl http://localhost:3000/_health
```

## Taxonomy Operations

### Create a Taxonomy
```bash
curl -X POST http://localhost:3000/test/taxonomies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Topics",
    "description": "Main topics for notes"
  }'
```

Expected response:
```json
{
  "id": 1,
  "name": "Topics",
  "description": "Main topics for notes",
  "slug": "topics"
}
```

### List Taxonomies
```bash
curl http://localhost:3000/test/taxonomies
```

### Create a Term
```bash
curl -X POST http://localhost:3000/test/taxonomies/topics/terms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Programming",
    "description": "Programming related notes",
    "slug": "programming"
  }'
```

Expected response:
```json
{
  "id": 1,
  "taxonomy_id": 1,
  "name": "Programming",
  "description": "Programming related notes",
  "slug": "programming"
}
```

### List Terms
```bash
curl http://localhost:3000/test/taxonomies/topics/terms
```

## Note Operations

### Create a Note
```bash
curl -X POST http://localhost:3000/test/notes \
  -H "Content-Type: application/json" \
  -d '{
    "zettel_id": "202401001",
    "title": "My First Note",
    "content": "---\ntags: [programming, typescript]\n---\n\nThis is the content of my first note."
  }'
```

Expected response:
```json
{
  "id": 1,
  "zettel_id": "202401001",
  "revision_id": 1,
  "title": "My First Note",
  "content": "---\ntags: [programming, typescript]\n---\n\nThis is the content of my first note.",
  "created_at": "2024-01-01T12:00:00.000Z",
  "updated_at": "2024-01-01T12:00:00.000Z",
  "deleted_at": null
}
```

### Get a Note
```bash
curl http://localhost:3000/test/notes/202401001
```

### Update a Note
```bash
curl -X PUT http://localhost:3000/test/notes/202401001 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Updated Note",
    "content": "---\ntags: [programming, typescript, updated]\n---\n\nThis is the updated content of my first note."
  }'
```

Expected response:
```json
{
  "id": 1,
  "zettel_id": "202401001",
  "revision_id": 2,
  "title": "My Updated Note",
  "content": "---\ntags: [programming, typescript, updated]\n---\n\nThis is the updated content of my first note.",
  "created_at": "2024-01-01T12:00:00.000Z",
  "updated_at": "2024-01-01T12:30:00.000Z",
  "deleted_at": null
}
```
