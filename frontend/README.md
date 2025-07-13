# Zettel Link Notes Frontend

A React TypeScript frontend application built with Vite for the Zettel Link Notes project.

## Features

- ⚡️ **Vite** - Fast build tool and development server
- ⚛️ **React 18** - Modern React with hooks
- 🔷 **TypeScript** - Type safety and better developer experience
- 🎨 **Prettier** - Code formatting
- 🔍 **ESLint** - Code linting and quality checks
- 🚀 **Hot Module Replacement** - Instant updates during development

## Prerequisites

- Node.js (version 16 or higher)
- Yarn

## Installation

1. Install dependencies:
   ```bash
   yarn install
   ```

## Available Scripts

- `yarn dev` - Start development server (usually on http://localhost:3001)
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint
- `yarn lint:fix` - Run ESLint and fix issues
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting

## Development

1. Start the development server:
   ```bash
   yarn dev
   ```

2. Open your browser and navigate to the URL shown in the terminal (usually http://localhost:3001)

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── vite.svg
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .eslintrc.cjs
├── .prettierrc
├── .prettierignore
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## API Integration

The development server is configured to proxy API requests to the backend:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- API requests to `/api/*` are automatically proxied to the backend

## Code Quality

- **ESLint**: Configured with TypeScript and React rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking enabled

## Next Steps

This is a fresh React TypeScript project ready for development. You can now:

1. Copy over existing React components from the previous implementation
2. Set up routing with React Router
3. Implement API services
4. Add styling and UI components

## Build

To build for production:

```bash
yarn build
```

The built files will be in the `dist/` directory.