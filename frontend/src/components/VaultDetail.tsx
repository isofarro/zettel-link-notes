import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { Note } from '../types';

const VaultDetail: React.FC = () => {
  const { vaultName } = useParams<{ vaultName: string }>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (vaultName) {
      loadVaultDetails();
    }
  }, [vaultName]);

  const loadVaultDetails = async () => {
    if (!vaultName) return;
    
    try {
      setLoading(true);
      const vaultDetails = await apiService.getVaultDetails(vaultName);
      setNotes(vaultDetails.notes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vault details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading vault details...</div>;
  }

  if (!vaultName) {
    return <div className="error">Vault name is required</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Vault: {vaultName}</h2>
        <div className="vault-actions">
          <Link to={`/vault/${vaultName}/new-note`} className="btn btn-primary">
            Create New Note
          </Link>
          <Link to={`/vault/${vaultName}/taxonomies`} className="btn btn-secondary">
            Manage Taxonomies
          </Link>
        </div>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="grid grid-2">
        {notes.map((note) => (
          <div key={note.zettel_id} className="card">
            <h3>
              <Link to={`/vault/${vaultName}/note/${note.zettel_id}`}>
                {note.title}
              </Link>
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: '0.5rem 0' }}>
              ID: {note.zettel_id}
            </p>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: '0.5rem 0' }}>
              Created: {formatDate(note.created_at)}
            </p>
            {note.content && (
              <p style={{ 
                marginTop: '1rem', 
                color: '#555',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}>
                {note.content.substring(0, 150)}...
              </p>
            )}
            <div style={{ marginTop: '1rem' }}>
              <Link 
                to={`/vault/${vaultName}/note/${note.zettel_id}`} 
                className="button"
              >
                Edit Note
              </Link>
            </div>
          </div>
        ))}
      </div>

      {notes.length === 0 && !loading && (
        <div className="card">
          <p>No notes found in this vault. <Link to={`/vault/${vaultName}/new-note`}>Create your first note!</Link></p>
        </div>
      )}
    </div>
  );
};

export default VaultDetail;