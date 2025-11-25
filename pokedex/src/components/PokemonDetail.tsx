import { useState } from 'react';
import type { Pokemon } from '../types/Pokemon';
import { Modal } from './Modal';
import { BoxForm } from './BoxForm';

interface PokemonDetailProps {
  pokemon: Pokemon | null;
  isOpen: boolean;
  onClose: () => void;
  onCaught?: (pokemonId: number) => void;
}

function StatGrid({ stats }: { stats: Pokemon['stats'] }) {
  const statsList = [
    { label: 'HP', value: stats.hp },
    { label: 'Attack', value: stats.attack },
    { label: 'Defense', value: stats.defense },
    { label: 'Sp. Atk', value: stats.specialAttack },
    { label: 'Sp. Def', value: stats.specialDefense },
    { label: 'Speed', value: stats.speed },
  ];

  return (
    <div className="stats-grid">
      {statsList.map(({ label, value }) => (
        <div key={label} className="stat-item">
          <div className="stat-label">{label}</div>
          <div className="stat-value">{value}</div>
        </div>
      ))}
    </div>
  );
}

function DetailFooter({ onClose, onCatch }: { onClose: () => void; onCatch: () => void }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button className="button button-secondary" onClick={onClose}>
        Close
      </button>
      <button className="button button-primary" onClick={onCatch}>
        Catch Pokémon
      </button>
    </div>
  );
}

export function PokemonDetail({ pokemon, isOpen, onClose, onCaught }: PokemonDetailProps) {
  const [showCatchForm, setShowCatchForm] = useState(false);

  if (!pokemon) return null;

  const handleCatchSuccess = () => {
    setShowCatchForm(false);
    onCaught?.(pokemon.id);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        title={pokemon.name}
        onClose={onClose}
        footer={<DetailFooter onClose={onClose} onCatch={() => setShowCatchForm(true)} />}
      >
        <div className="pokemon-detail">
          <div className="pokemon-detail-image">
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          </div>
          <div>
            <div className="pokemon-detail-types">
              {pokemon.types.map((type) => (
                <span key={type.name} className={`type-badge type-${type.name}`}>
                  {type.name}
                </span>
              ))}
            </div>
            <p className="pokemon-description">{pokemon.description}</p>

            <h3>Base Stats</h3>
            <StatGrid stats={pokemon.stats} />

            {pokemon.moves.length > 0 && (
              <div className="moves-section">
                <h3>Moves</h3>
                <div className="moves-grid">
                  {pokemon.moves.slice(0, 4).map((move) => (
                    <div key={move.name} className="move-item">
                      <div className="move-name">{move.name}</div>
                      <div className="move-power">
                        {move.power ? `Power: ${move.power}` : 'Status Move'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      <Modal isOpen={showCatchForm} title={`Catch ${pokemon.name}`} onClose={() => setShowCatchForm(false)}>
        <BoxForm pokemonId={pokemon.id} onSuccess={handleCatchSuccess} onCancel={() => setShowCatchForm(false)} />
      </Modal>
    </>
  );
}
