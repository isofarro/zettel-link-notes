import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Note } from '../types';

const NoteEditor: React.FC = () => {
  const { vaultName, zettelId } = useParams<{
    vaultName: string;
    zettelId?: string;
  }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Partial<Note>>({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(zettelId);

  useEffect(() => {
    if (isEditing && zettelId && vaultName) {
      loadNote();
    }
  }, [zettelId, vaultName, isEditing]);

  const loadNote = async () => {
    if (!zettelId || !vaultName) return;

    try {
      setLoading(true);
      const noteData = await apiService.getNote(vaultName, zettelId);
      setNote(noteData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load note');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaultName || !note.title?.trim() || !note.content?.trim()) return;

    try {
      setSaving(true);
      setError(null);

      const noteData = {
        title: note.title.trim(),
        content: note.content.trim(),
      };

      if (isEditing && zettelId) {
        await apiService.updateNote(vaultName, zettelId, noteData);
      } else {
        await apiService.createNote(vaultName, noteData);
      }

      navigate(`/vault/${vaultName}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/vault/${vaultName}`);
  };

  if (loading) {
    return <div className="loading">Loading note...</div>;
  }

  if (!vaultName) {
    return <div className="error">Vault name is required</div>;
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <h2>
          {isEditing ? 'Edit Note' : 'Create New Note'} in {vaultName}
        </h2>
        <button onClick={handleCancel} className="button button-secondary">
          Cancel
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              type="text"
              className="input"
              value={note.title || ''}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
              placeholder="Enter note title"
              disabled={saving}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              className="textarea"
              value={note.content || ''}
              onChange={(e) => setNote({ ...note, content: e.target.value })}
              placeholder="Enter note content (supports Markdown)"
              disabled={saving}
              required
              style={{ minHeight: '400px' }}
            />
          </div>

          {isEditing && note.zettel_id && (
            <div className="form-group">
              <label>Zettel ID:</label>
              <input
                type="text"
                className="input"
                value={note.zettel_id}
                disabled
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              className="button"
              disabled={saving || !note.title?.trim() || !note.content?.trim()}
            >
              {saving ? 'Saving...' : isEditing ? 'Update Note' : 'Create Note'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="button button-secondary"
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {isEditing && note.created_at && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3>Note Information</h3>
          <p>
            <strong>Created:</strong>{' '}
            {new Date(note.created_at).toLocaleString()}
          </p>
          {note.updated_at && note.updated_at !== note.created_at && (
            <p>
              <strong>Last Updated:</strong>{' '}
              {new Date(note.updated_at).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default NoteEditor;
