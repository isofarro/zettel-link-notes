import * as restify from 'restify';
import corsMiddleware from 'restify-cors-middleware2';
import { notesRoutes } from './routes/notes';
import { taxonomyRoutes } from './routes/taxonomy';
import { vaultRoutes } from './routes/vaults';
import { VaultManager } from './db';
import { NoteRepository } from './repositories/noteRepository';
import { TaxonomyRepository } from './repositories/taxonomyRepository';

const server = restify.createServer({
  name: 'zettel-link-notes-api',
  version: '1.0.0',
});

// Configure CORS
const cors = corsMiddleware({
  origins: ['*'], // Configure this appropriately for production
  allowHeaders: ['Authorization'],
  exposeHeaders: ['Authorization'],
});

// Middleware
server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.fullResponse());

// Initialize vault manager and repositories
const vaultManager = new VaultManager();
const noteRepo = new NoteRepository(vaultManager);
const taxonomyRepo = new TaxonomyRepository(vaultManager);

// Routes - register vault routes first for proper matching
vaultRoutes(server, vaultManager, noteRepo);
notesRoutes(server, noteRepo);
taxonomyRoutes(server, taxonomyRepo);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`${server.name} listening at ${server.url}`);
});
