import * as restify from 'restify';
import corsMiddleware from 'restify-cors-middleware2';
import { notesRoutes } from './routes/notes';
import { taxonomyRoutes } from './routes/taxonomy';
import { vaultRoutes } from './routes/vaults';
import { VaultManager } from './db';
import { NoteRepository } from './repositories/noteRepository';
import { TaxonomyRepository } from './repositories/taxonomyRepository';
import { VaultService } from './services/vaultService';
import { NoteService } from './services/noteService';
import { TaxonomyService } from './services/taxonomyService';

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

// Initialize services and repositories
const vaultManager = new VaultManager();
const noteRepo = new NoteRepository(vaultManager);
const taxonomyRepo = new TaxonomyRepository(vaultManager);

// Initialize services
const vaultService = new VaultService(vaultManager, noteRepo);
const noteService = new NoteService(noteRepo);
const taxonomyService = new TaxonomyService(taxonomyRepo);

// Routes - register vault routes first for proper matching
vaultRoutes(server, vaultService);
notesRoutes(server, noteService);
taxonomyRoutes(server, taxonomyService);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`${server.name} listening at ${server.url}`);
});
