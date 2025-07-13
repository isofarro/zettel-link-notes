import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import VaultList from './components/VaultList';
import VaultDetail from './components/VaultDetail';
import NoteEditor from './components/NoteEditor';
import TaxonomyManager from './components/TaxonomyManager';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <Link to="/" className="nav-link">Vaults</Link>
          </nav>
          <h1>Zettel Link Notes</h1>
        </header>
        
        <main className="App-main">
          <Routes>
            <Route path="/" element={<VaultList />} />
            <Route path="/vault/:vaultName" element={<VaultDetail />} />
            <Route path="/vault/:vaultName/note/:zettelId" element={<NoteEditor />} />
            <Route path="/vault/:vaultName/new-note" element={<NoteEditor />} />
            <Route path="/vault/:vaultName/taxonomies" element={<TaxonomyManager />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;