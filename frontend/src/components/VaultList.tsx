import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { VaultInfo } from '../types';

const VaultList: React.FC = () => {
  const [vaults, setVaults] = useState<VaultInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newVaultName, setNewVaultName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadVaults();
  }, []);

  const loadVaults = async () => {
    try {
      setLoading(true);
      const vaultList = await apiService.getVaults();
      setVaults(vaultList);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vaults');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVault = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVaultName.trim()) return;

    try {
      setCreating(true);
      await apiService.createVault(newVaultName.trim());
      setNewVaultName('');
      await loadVaults();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create vault');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading vaults...</div>;
  }

  return (
    <div>
      <h2>Vaults</h2>
      
      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="card">
        <h3>Create New Vault</h3>
        <form onSubmit={handleCreateVault}>
          <div className="form-group">
            <label htmlFor="vaultName">Vault Name:</label>
            <input
              id="vaultName"
              type="text"
              className="input"
              value={newVaultName}
              onChange={(e) => setNewVaultName(e.target.value)}
              placeholder="Enter vault name"
              disabled={creating}
            />
          </div>
          <button 
            type="submit" 
            className="button"
            disabled={creating || !newVaultName.trim()}
          >
            {creating ? 'Creating...' : 'Create Vault'}
          </button>
        </form>
      </div>

      <div className="grid grid-2">
        {vaults.map((vault) => (
          <div key={vault.name} className="card">
            <h3>{vault.name}</h3>
            <div style={{ marginTop: '1rem' }}>
              <Link 
                to={`/vault/${vault.name}`} 
                className="button"
                style={{ marginRight: '0.5rem' }}
              >
                Open Vault
              </Link>
              <Link 
                to={`/vault/${vault.name}/new-note`} 
                className="button button-secondary"
              >
                New Note
              </Link>
            </div>
          </div>
        ))}
      </div>

      {vaults.length === 0 && !loading && (
        <div className="card">
          <p>No vaults found. Create your first vault above!</p>
        </div>
      )}
    </div>
  );
};

export default VaultList;