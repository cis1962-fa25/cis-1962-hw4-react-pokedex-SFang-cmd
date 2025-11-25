import { useState, useEffect } from 'react';
import type { Pokemon } from '../types/Pokemon';
import { pokemonAPI } from '../api/PokemonAPI';
import { PokemonCard } from './PokemonCard';
import { PokemonDetail } from './PokemonDetail';

const PAGE_SIZE = 10;

export function PokemonList() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await pokemonAPI.getPokemonList(PAGE_SIZE, currentPage * PAGE_SIZE);
        setPokemon(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch Pokemon');
        setPokemon([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [currentPage]);

  const handleSelectPokemon = async (p: Pokemon) => {
    setLoading(true);
    try {
      const details = await pokemonAPI.getPokemonByName(p.name);
      setSelectedPokemon(details);
      setShowDetail(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Pokemon details');
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const isInitialLoading = loading && currentPage === 0;
  const isEmpty = pokemon.length === 0;
  const showContent = !isInitialLoading && !isEmpty;

  const handleCloseDetail = () => setShowDetail(false);

  return (
    <>
      {error && <div className="error-message">{error}</div>}

      {isInitialLoading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading Pokémon...</p>
        </div>
      )}

      {isEmpty && (
        <div className="empty-state">
          <div className="empty-state-icon">:(</div>
          <h3>No Pokémon Found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}

      {showContent && (
        <>
          <div className="pokemon-grid">
            {pokemon.map((p) => (
              <PokemonCard key={p.id} pokemon={p} onClick={() => handleSelectPokemon(p)} />
            ))}
          </div>

          <div className="pagination">
            <button onClick={handlePrevPage} disabled={currentPage === 0} className="button button-secondary">
              ← Previous
            </button>
            <span className="pagination-info">Page {currentPage + 1}</span>
            <button onClick={handleNextPage} disabled={pokemon.length < PAGE_SIZE} className="button button-secondary">
              Next →
            </button>
          </div>
        </>
      )}

      <PokemonDetail
        pokemon={selectedPokemon}
        isOpen={showDetail}
        onClose={handleCloseDetail}
        onCaught={handleCloseDetail}
      />
    </>
  );
}
