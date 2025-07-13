# Zettel Link Notes Frontend

A React TypeScript frontend for the Zettel Link Notes application.

## Features

- **Vault Management**: Create and browse vaults
- **Note Editor**: Create and edit notes with Markdown support
- **Taxonomy System**: Manage taxonomies and terms for organizing content
- **Responsive Design**: Modern, clean UI that works on desktop and mobile

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Backend server running on `http://localhost:3000`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

## Project Structure

```
src/
├── components/          # React components
│   ├── VaultList.tsx   # Vault listing and creation
│   ├── VaultDetail.tsx # Notes within a vault
│   ├── NoteEditor.tsx  # Note creation and editing
│   └── TaxonomyManager.tsx # Taxonomy and term management
├── services/
│   └── api.ts          # API service for backend communication
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
├── App.css             # Application styles
├── index.tsx           # Application entry point
└── index.css           # Global styles
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## API Integration

The frontend communicates with the backend API through the `apiService` class in `src/services/api.ts`. The API base URL is configured to proxy requests to `http://localhost:3000` via the `proxy` field in `package.json`.

## Styling

The application uses custom CSS with a modern, clean design. Key styling features:

- Responsive grid layouts
- Card-based UI components
- Consistent color scheme
- Accessible form controls

## Development

### Adding New Components

1. Create new component files in `src/components/`
2. Export the component as default
3. Import and use in `App.tsx` or other components

### API Integration

To add new API endpoints:

1. Add the method to `apiService` in `src/services/api.ts`
2. Use the method in your components with proper error handling
3. Update TypeScript types in `src/types.ts` if needed

## Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files ready for deployment.