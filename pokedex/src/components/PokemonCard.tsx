import type { Pokemon } from '../types/Pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void;
}

export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  return (
    <div className="pokemon-card" onClick={onClick}>
      <div className="pokemon-card-image">
        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      </div>
      <div className="pokemon-card-body">
        <div className="pokemon-card-id">#{pokemon.id.toString().padStart(3, '0')}</div>
        <div className="pokemon-card-name">{pokemon.name}</div>
        <div className="pokemon-card-types">
          {pokemon.types.map((type) => (
            <span key={type.name} className={`type-badge type-${type.name}`}>
              {type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
