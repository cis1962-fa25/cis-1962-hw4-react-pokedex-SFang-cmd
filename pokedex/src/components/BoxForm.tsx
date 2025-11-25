import { useState } from 'react';
import type { InsertBoxEntry, UpdateBoxEntry, BoxEntry } from '../types/Box';
import { pokemonAPI } from '../api/PokemonAPI';

interface BoxFormProps {
  pokemonId?: number;
  entry?: BoxEntry;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  pokemonId: number;
  location: string;
  level: number;
  createdAt: string;
  notes: string;
}

function FormGroup({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="form-group">
      <label className="form-label">
        {label} {required && '*'}
      </label>
      {children}
    </div>
  );
}

export function BoxForm({ pokemonId, entry, onSuccess, onCancel }: BoxFormProps) {
  const isEditing = !!entry;

  const [formData, setFormData] = useState<FormData>({
    pokemonId: pokemonId || entry?.pokemonId || 0,
    location: entry?.location || '',
    level: entry?.level || 1,
    createdAt: entry?.createdAt || new Date().toISOString(),
    notes: entry?.notes || '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    if (!formData.location.trim()) {
      setError('Location is required');
      return false;
    }
    if (formData.level < 1 || formData.level > 100) {
      setError('Level must be between 1 and 100');
      return false;
    }
    return true;
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      if (isEditing && entry) {
        const updates: UpdateBoxEntry = {
          location: formData.location,
          level: formData.level,
          notes: formData.notes || undefined,
        };
        await pokemonAPI.updateBoxEntry(entry.id, updates);
      } else {
        const newEntry: InsertBoxEntry = {
          pokemonId: formData.pokemonId,
          location: formData.location,
          level: formData.level,
          createdAt: new Date().toISOString(),
          notes: formData.notes || undefined,
        };
        await pokemonAPI.createBoxEntry(newEntry);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  const submitLabel = loading ? 'Saving...' : isEditing ? 'Update Entry' : 'Catch Pokémon';

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}

      {!isEditing && (
        <FormGroup label="Pokémon ID">
          <input type="number" className="form-input" value={formData.pokemonId} disabled />
        </FormGroup>
      )}

      <FormGroup label="Location" required>
        <input
          type="text"
          className="form-input"
          value={formData.location}
          onChange={(e) => updateFormData({ location: e.target.value })}
          placeholder="e.g., Viridian Forest, Route 1"
        />
      </FormGroup>

      <FormGroup label="Level" required>
        <input
          type="number"
          className="form-input"
          min="1"
          max="100"
          value={formData.level}
          onChange={(e) => updateFormData({ level: parseInt(e.target.value) || 1 })}
        />
      </FormGroup>

      <FormGroup label="Notes">
        <textarea
          className="form-textarea"
          value={formData.notes}
          onChange={(e) => updateFormData({ notes: e.target.value })}
          placeholder="Optional notes about this catch"
        />
      </FormGroup>

      <div className="form-actions">
        <button type="button" className="button button-secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="button button-primary" disabled={loading}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
