import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import { Taxonomy, TaxonomyTerm } from '../types';

const TaxonomyManager: React.FC = () => {
  const { vaultName } = useParams<{ vaultName: string }>();
  const [taxonomies, setTaxonomies] = useState<Taxonomy[]>([]);
  const [selectedTaxonomy, setSelectedTaxonomy] = useState<Taxonomy | null>(null);
  const [terms, setTerms] = useState<TaxonomyTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [newTaxonomyName, setNewTaxonomyName] = useState('');
  const [newTaxonomyDescription, setNewTaxonomyDescription] = useState('');
  const [newTermName, setNewTermName] = useState('');
  const [newTermDescription, setNewTermDescription] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadTaxonomies();
  }, [vaultName]);

  if (!vaultName) {
    return <div>Error: No vault specified</div>;
  }

  useEffect(() => {
    if (selectedTaxonomy) {
      loadTerms(selectedTaxonomy.slug);
    }
  }, [selectedTaxonomy]);

  const loadTaxonomies = async () => {
    if (!vaultName) return;
    try {
      setLoading(true);
      const taxonomyList = await apiService.getTaxonomies(vaultName);
      setTaxonomies(taxonomyList);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load taxonomies');
    } finally {
      setLoading(false);
    }
  };

  const loadTerms = async (taxonomySlug: string) => {
    if (!vaultName) return;
    try {
      const termList = await apiService.getTaxonomyTerms(vaultName, taxonomySlug);
      setTerms(termList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load terms');
    }
  };

  const handleCreateTaxonomy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaxonomyName.trim() || !vaultName) return;

    try {
      setCreating(true);
      const taxonomy = await apiService.createTaxonomy(vaultName, {
        name: newTaxonomyName.trim(),
        description: newTaxonomyDescription.trim() || undefined
      });
      setNewTaxonomyName('');
      setNewTaxonomyDescription('');
      await loadTaxonomies();
      setSelectedTaxonomy(taxonomy);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create taxonomy');
    } finally {
      setCreating(false);
    }
  };

  const handleCreateTerm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTermName.trim() || !selectedTaxonomy || !vaultName) return;

    try {
      setCreating(true);
      await apiService.createTaxonomyTerm(vaultName, selectedTaxonomy.slug, {
        name: newTermName.trim(),
        description: newTermDescription.trim() || undefined
      });
      setNewTermName('');
      setNewTermDescription('');
      await loadTerms(selectedTaxonomy.slug);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create term');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading taxonomies...</div>;
  }

  return (
    <div>
      <h2>Taxonomy Manager</h2>
      
      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Taxonomies Section */}
        <div>
          <div className="card">
            <h3>Create New Taxonomy</h3>
            <form onSubmit={handleCreateTaxonomy}>
              <div className="form-group">
                <label htmlFor="taxonomyName">Name:</label>
                <input
                  id="taxonomyName"
                  type="text"
                  className="input"
                  value={newTaxonomyName}
                  onChange={(e) => setNewTaxonomyName(e.target.value)}
                  placeholder="Enter taxonomy name"
                  disabled={creating}
                />
              </div>
              <div className="form-group">
                <label htmlFor="taxonomyDescription">Description (optional):</label>
                <textarea
                  id="taxonomyDescription"
                  className="textarea"
                  value={newTaxonomyDescription}
                  onChange={(e) => setNewTaxonomyDescription(e.target.value)}
                  placeholder="Enter taxonomy description"
                  disabled={creating}
                  style={{ minHeight: '100px' }}
                />
              </div>
              <button 
                type="submit" 
                className="button"
                disabled={creating || !newTaxonomyName.trim()}
              >
                {creating ? 'Creating...' : 'Create Taxonomy'}
              </button>
            </form>
          </div>

          <div className="card">
            <h3>Taxonomies</h3>
            {taxonomies.length === 0 ? (
              <p>No taxonomies found. Create your first taxonomy above!</p>
            ) : (
              <div>
                {taxonomies.map((taxonomy) => (
                  <div 
                    key={taxonomy.id} 
                    className={`card ${selectedTaxonomy?.id === taxonomy.id ? 'selected' : ''}`}
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: selectedTaxonomy?.id === taxonomy.id ? '#e3f2fd' : 'white',
                      border: selectedTaxonomy?.id === taxonomy.id ? '2px solid #61dafb' : '1px solid #ddd'
                    }}
                    onClick={() => setSelectedTaxonomy(taxonomy)}
                  >
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{taxonomy.name}</h4>
                    <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>Slug: {taxonomy.slug}</p>
                    {taxonomy.description && (
                      <p style={{ margin: '0.5rem 0 0 0', color: '#555' }}>{taxonomy.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Terms Section */}
        <div>
          {selectedTaxonomy && (
            <>
              <div className="card">
                <h3>Add Term to "{selectedTaxonomy.name}"</h3>
                <form onSubmit={handleCreateTerm}>
                  <div className="form-group">
                    <label htmlFor="termName">Name:</label>
                    <input
                      id="termName"
                      type="text"
                      className="input"
                      value={newTermName}
                      onChange={(e) => setNewTermName(e.target.value)}
                      placeholder="Enter term name"
                      disabled={creating}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="termDescription">Description (optional):</label>
                    <textarea
                      id="termDescription"
                      className="textarea"
                      value={newTermDescription}
                      onChange={(e) => setNewTermDescription(e.target.value)}
                      placeholder="Enter term description"
                      disabled={creating}
                      style={{ minHeight: '100px' }}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="button"
                    disabled={creating || !newTermName.trim()}
                  >
                    {creating ? 'Creating...' : 'Add Term'}
                  </button>
                </form>
              </div>

              <div className="card">
                <h3>Terms in "{selectedTaxonomy.name}"</h3>
                {terms.length === 0 ? (
                  <p>No terms found. Add your first term above!</p>
                ) : (
                  <div>
                    {terms.map((term) => (
                      <div key={term.id} className="card">
                        <h4 style={{ margin: '0 0 0.5rem 0' }}>{term.name}</h4>
                        <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>Slug: {term.slug}</p>
                        {term.description && (
                          <p style={{ margin: '0.5rem 0 0 0', color: '#555' }}>{term.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {!selectedTaxonomy && taxonomies.length > 0 && (
            <div className="card">
              <p>Select a taxonomy from the left to view and manage its terms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaxonomyManager;