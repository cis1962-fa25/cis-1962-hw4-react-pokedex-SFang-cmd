import type { Pokemon } from '../types/Pokemon';
import type { BoxEntry, InsertBoxEntry, UpdateBoxEntry } from '../types/Box';

const BASE_URL = 'https://hw4.cis1962.esinx.net/api';

export class PokemonAPI {
  private token: string | null = null;

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken(): void {
    this.token = null;
  }

  // ==================== POKEMON ENDPOINTS ====================

  /**
   * Get a paginated list of Pokemon
   * @param limit Maximum number of Pokemon to return
   * @param offset Number of Pokemon to skip (for pagination)
   * @returns Array of Pokemon
   */
  async getPokemonList(limit: number, offset: number): Promise<Pokemon[]> {
    const response = await fetch(`${BASE_URL}/pokemon/?limit=${limit}&offset=${offset}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${response.status} ${error.code}: ${error.message}`);
    }

    return response.json();
  }

  /**
   * Get detailed information about a specific Pokemon by name.
   * Assumes COMPLETE pre-processing already
   * @param name The name of the Pokemon (case-insensitive)
   * @returns Detailed Pokemon data
   */
  async getPokemonByName(name: string): Promise<Pokemon> {
    const response = await fetch(`${BASE_URL}/pokemon/${name}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${response.status} ${error.code}: ${error.message}`);
    }

    return response.json();
  }

  // ==================== BOX ENDPOINTS ====================

  /**
   * Get all Box entry IDs for the authenticated user
   * @returns Array of Box entry IDs
   */
  async getBoxEntryIds(): Promise<string[]> {
    if (!this.token) {
      throw new Error('Authentication token required. Please set token with setToken().');
    }

    const response = await fetch(`${BASE_URL}/box/`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${response.status} ${error.code}: ${error.message}`);
    }

    return response.json();
  }

  /**
   * Get a specific Box entry by ID
   * @param id The Box entry ID
   * @returns The Box entry
   */
  async getBoxEntry(id: string): Promise<BoxEntry> {
    if (!this.token) {
      throw new Error('Authentication token required. Please set token with setToken().');
    }

    const response = await fetch(`${BASE_URL}/box/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${response.status} ${error.code}: ${error.message}`);
    }

    return response.json();
  }

  /**
   * Create a new Box entry
   * @param entry The Box entry data to create
   * @returns The created Box entry with generated ID
   */
  async createBoxEntry(entry: InsertBoxEntry): Promise<BoxEntry> {
    if (!this.token) {
      throw new Error('Authentication token required. Please set token with setToken().');
    }

    const response = await fetch(`${BASE_URL}/box/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${response.status} ${error.code}: ${error.message}`);
    }

    return response.json();
  }

  /**
   * Update an existing Box entry
   * @param id The Box entry ID
   * @param updates The fields to update (all optional)
   * @returns The updated Box entry
   */
  async updateBoxEntry(id: string, updates: UpdateBoxEntry): Promise<BoxEntry> {
    if (!this.token) {
      throw new Error('Authentication token required. Please set token with setToken().');
    }

    const response = await fetch(`${BASE_URL}/box/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${response.status} ${error.code}: ${error.message}`);
    }

    return response.json();
  }

  /**
   * Delete a specific Box entry
   * @param id The Box entry ID
   */
  async deleteBoxEntry(id: string): Promise<void> {
    if (!this.token) {
      throw new Error('Authentication token required. Please set token with setToken().');
    }

    const response = await fetch(`${BASE_URL}/box/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${response.status} ${error.code}: ${error.message}`);
    }
  }

  /**
   * Delete all Box entries for the authenticated user
   */
  async clearAllBoxEntries(): Promise<void> {
    if (!this.token) {
      throw new Error('Authentication token required. Please set token with setToken().');
    }

    const response = await fetch(`${BASE_URL}/box/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${response.status} ${error.code}: ${error.message}`);
    }
  }
}

// Export a singleton instance
export const pokemonAPI = new PokemonAPI();
