import { useState, useEffect } from 'react';
import type { BoxEntry } from '../types/Box';
import type { Pokemon } from '../types/Pokemon';
import { pokemonAPI } from '../api/PokemonAPI';
import { BoxCard } from './BoxCard';

interface BoxListProps {
  pokemonIdToName: Map<number, string>;
  allPokemon: Map<string, Pokemon>;
}

export function BoxList({ pokemonIdToName, allPokemon }: BoxListProps) {
  const [entries, setEntries] = useState<BoxEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoxEntries = async () => {
      setLoading(true);
      setError(null);
      try {
        const ids = await pokemonAPI.getBoxEntryIds();
        const boxEntries = await Promise.all(ids.map((id) => pokemonAPI.getBoxEntry(id)));
        setEntries(boxEntries);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch Box entries');
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBoxEntries();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const ids = await pokemonAPI.getBoxEntryIds();
      const boxEntries = await Promise.all(ids.map((id) => pokemonAPI.getBoxEntry(id)));
      setEntries(boxEntries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh Box');
    } finally {
      setLoading(false);
    }
  };

  const handleEntryDelete = () => {
    handleRefresh();
  };

  if (loading && entries.length === 0) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading your Box...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="error-message">{error}</div>
        <button className="button button-secondary" onClick={handleRefresh}>
          Try Again
        </button>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🎯</div>
        <h3>Your Box is Empty</h3>
        <p>Go catch some Pokémon to add them here!</p>
      </div>
    );
  }

  const renderEntry = (entry: BoxEntry) => {
    const pokemonName = pokemonIdToName.get(entry.pokemonId);
    const pokemon = pokemonName ? allPokemon.get(pokemonName) : null;

    if (!pokemon) {
      return (
        <div key={entry.id} className="box-card">
          <div className="box-card-body">
            <div className="box-card-name">Unknown Pokémon</div>
            <div className="box-card-detail">ID: {entry.pokemonId}</div>
          </div>
        </div>
      );
    }

    return (
      <BoxCard
        key={entry.id}
        entry={entry}
        pokemon={pokemon}
        onUpdate={handleRefresh}
        onDelete={handleEntryDelete}
      />
    );
  };

  return (
    <>
      <div className="box-header">
        <h2>My Pokédex ({entries.length} caught)</h2>
        <button className="button button-secondary" onClick={handleRefresh} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="box-grid">
        {entries.map(renderEntry)}
      </div>
    </>
  );
}
