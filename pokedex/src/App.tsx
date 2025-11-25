import { useState, useEffect } from 'react';
import type { Pokemon } from './types/Pokemon';
import { pokemonAPI } from './api/PokemonAPI';
import { PokemonList } from './components/PokemonList';
import { BoxList } from './components/BoxList';
import './pokedex.css';

type View = 'pokemon' | 'box';

function App() {
  const [view, setView] = useState<View>('pokemon');
  const [pokemonIdToName, setPokemonIdToName] = useState<Map<number, string>>(new Map());
  const [allPokemon, setAllPokemon] = useState<Map<string, Pokemon>>(new Map());
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Initialize Pokemon mapping and set API token
  useEffect(() => {
    const initializeApp = async () => {
      const token = import.meta.env.VITE_API_TOKEN;

      if (!token) {
        setTokenError('Please set your JWT token in .env.local (VITE_API_TOKEN)');
      } else {
        pokemonAPI.setToken(token);
      }

      // Build Pokemon ID-to-name mapping
      try {
        const allPokemonMap = new Map<string, Pokemon>();
        const idToNameMap = new Map<number, string>();

        // Fetch first page of Pokemon to start the mapping (lazy loading)
        const initialPokemon = await pokemonAPI.getPokemonList(10, 0);
        initialPokemon.forEach((p) => {
          idToNameMap.set(p.id, p.name);
          allPokemonMap.set(p.name, p);
        });

        setPokemonIdToName(idToNameMap);
        setAllPokemon(allPokemonMap);
      } catch (err) {
        console.error('Failed to build Pokemon mapping:', err);
      }
    };

    initializeApp();
  }, []);

  const handleSetToken = () => {
    const token = prompt('Enter your JWT token from HW2:');
    if (token) {
      pokemonAPI.setToken(token);
      setTokenError(null);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Pokédex</h1>
        <p>Catch and collect Pokémon!</p>
      </header>

      {tokenError && (
        <div style={{ padding: '1rem 2rem', background: '#fff3cd', border: '1px solid #ffc107' }}>
          <p style={{ margin: 0, marginBottom: '0.5rem' }}>{tokenError}</p>
          <button className="button button-secondary" onClick={handleSetToken}>
            Set Token Now
          </button>
        </div>
      )}

      <nav className="app-nav">
        <button
          className={`nav-button ${view === 'pokemon' ? 'active' : ''}`}
          onClick={() => setView('pokemon')}
        >
          <img src="/images/icons/pokeball.png" alt="Pokeball" className="nav-icon" />
          All Pokémon
        </button>
        <button className={`nav-button ${view === 'box' ? 'active' : ''}`} onClick={() => setView('box')}>
          <img src="/images/icons/pokemon_pc.jpg" alt="PC Box" className="nav-icon" />
          My Box
        </button>
      </nav>

      <main className="app-content">
        {view === 'pokemon' && <PokemonList />}
        {view === 'box' && <BoxList pokemonIdToName={pokemonIdToName} allPokemon={allPokemon} />}
      </main>
    </div>
  );
}

export default App;
