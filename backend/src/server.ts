import * as restify from 'restify';
import corsMiddleware from 'restify-cors-middleware2';
import { notesRoutes } from './routes/notes';
import { taxonomyRoutes } from './routes/taxonomy';

const server = restify.createServer({
  name: 'zettel-link-notes-api',
  version: '1.0.0'
});

// Configure CORS
const cors = corsMiddleware({
  origins: ['*'], // Configure this appropriately for production
  allowHeaders: ['Authorization'],
  exposeHeaders: ['Authorization']
});

// Middleware
server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

// Routes
notesRoutes(server);
taxonomyRoutes(server);

// Basic health check endpoint
server.get('/health', (req: restify.Request, res: restify.Response, next: restify.Next) => {
  res.send(200, { status: 'ok' });
  return next();
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`${server.name} listening at ${server.url}`);
});