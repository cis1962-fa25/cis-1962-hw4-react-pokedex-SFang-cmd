import { useState } from 'react';
import type { BoxEntry } from '../types/Box';
import type { Pokemon } from '../types/Pokemon';
import { Modal } from './Modal';
import { BoxForm } from './BoxForm';
import { pokemonAPI } from '../api/PokemonAPI';

interface BoxCardProps {
  entry: BoxEntry;
  pokemon: Pokemon;
  onUpdate: () => void;
  onDelete: () => void;
}

export function BoxCard({ entry, pokemon, onUpdate, onDelete }: BoxCardProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await pokemonAPI.deleteBoxEntry(entry.id);
      onDelete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete entry');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const handleEditClose = () => setShowEditForm(false);
  const handleDeleteClose = () => setShowDeleteConfirm(false);
  const handleEditSuccess = () => {
    setShowEditForm(false);
    onUpdate();
  };

  return (
    <>
      <div className="box-card">
        <div className="box-card-image">
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        </div>
        <div className="box-card-body">
          <div className="box-card-name">{pokemon.name}</div>
          <div className="box-card-detail">
            <span className="box-card-detail-label">Level:</span> {entry.level}
          </div>
          <div className="box-card-detail">
            <span className="box-card-detail-label">Location:</span> {entry.location}
          </div>
          <div className="box-card-detail">
            <span className="box-card-detail-label">Caught:</span> {formatDate(entry.createdAt)}
          </div>
          {entry.notes && <div className="box-card-notes">"{entry.notes}"</div>}
          <div className="box-card-actions">
            <button className="button button-secondary button-small" onClick={() => setShowEditForm(true)}>
              Edit
            </button>
            <button className="button button-danger button-small" onClick={() => setShowDeleteConfirm(true)}>
              Delete
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={showEditForm} title={`Edit ${pokemon.name}`} onClose={handleEditClose}>
        <BoxForm entry={entry} onSuccess={handleEditSuccess} onCancel={handleEditClose} />
      </Modal>

      <Modal isOpen={showDeleteConfirm} title="Confirm Delete" onClose={handleDeleteClose}>
        {error && <div className="error-message">{error}</div>}
        <p>Are you sure you want to release {pokemon.name}? This cannot be undone.</p>
        <div className="modal-footer">
          <button className="button button-secondary" onClick={handleDeleteClose} disabled={loading}>
            Cancel
          </button>
          <button className="button button-danger" onClick={handleDeleteConfirm} disabled={loading}>
            {loading ? 'Releasing...' : 'Yes, Release'}
          </button>
        </div>
      </Modal>
    </>
  );
}
