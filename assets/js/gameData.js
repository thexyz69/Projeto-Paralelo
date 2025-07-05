// Centralized game data management
class GameDataManager {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  async loadGameData() {
    const cacheKey = 'gameData';
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch('/pages/infojogos.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to load game data:', error);
      
      // Return fallback data
      return this.getFallbackData();
    }
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  getFallbackData() {
    return {
      jogo01: {
        title: "Stardew Valley",
        image: "/assets/imgs/12anos.png",
        description: "Um RPG relaxante de vida no campo...",
        rating: "12+",
        genre: "RPG",
        link: "https://x.com/concernedape"
      }
      // Add more fallback data as needed
    };
  }

  async getGameById(gameId) {
    const allGames = await this.loadGameData();
    return allGames[gameId] || null;
  }

  async searchGames(query) {
    const allGames = await this.loadGameData();
    const results = [];
    
    for (const [id, game] of Object.entries(allGames)) {
      if (
        game.title.toLowerCase().includes(query.toLowerCase()) ||
        game.genre.toLowerCase().includes(query.toLowerCase())
      ) {
        results.push({ id, ...game });
      }
    }
    
    return results;
  }
}

export default new GameDataManager();