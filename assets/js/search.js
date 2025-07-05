import { debounce, storage, handleError } from './utils.js';

class GameSearch {
  constructor() {
    this.games = [
      { name: "Stardew Valley", id: "jogo01", category: "RPG" },
      { name: "Red Dead 2", id: "jogo02", category: "TIRO" },
      { name: "Baldurs Gate", id: "jogo03", category: "RPG" },
      { name: "Valorant", id: "jogo04", category: "TIRO" },
      { name: "Alien Isolation", id: "jogo05", category: "TERROR" },
      { name: "Out last", id: "jogo06", category: "TERROR" },
      { name: "God Of War", id: "jogo07", category: "AVENTURA" },
      { name: "The Last Of Us Part 2", id: "jogo08", category: "AVENTURA" },
      { name: "Euro Truck Simulator", id: "jogo09", category: "SIMULADOR" },
      { name: "Goat Simulator", id: "jogo10", category: "SIMULADOR" },
      { name: "Grand Theft Auto V", id: "jogo11", category: "TIRO" },
      { name: "Elden Ring", id: "jogo12", category: "RPG" }
    ];
    
    this.searchInput = null;
    this.suggestions = null;
    this.activeSuggestion = -1;
    this.searchHistory = storage.get('searchHistory') || [];
    
    this.init();
  }

  init() {
    this.searchInput = document.getElementById('searchInput');
    this.suggestions = document.getElementById('suggestions');
    
    if (!this.searchInput) return;

    this.setupEventListeners();
    this.createSuggestionsContainer();
  }

  setupEventListeners() {
    // Debounced search input
    const debouncedSearch = debounce((e) => {
      this.handleSearch(e.target.value);
    }, 300);

    this.searchInput.addEventListener('input', debouncedSearch);
    this.searchInput.addEventListener('keydown', (e) => this.handleKeydown(e));
    this.searchInput.addEventListener('focus', () => this.showRecentSearches());
    
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search')) {
        this.hideSuggestions();
      }
    });
  }

  createSuggestionsContainer() {
    if (!this.suggestions) {
      this.suggestions = document.createElement('div');
      this.suggestions.id = 'suggestions';
      this.suggestions.className = 'suggestions';
      this.suggestions.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        max-height: 300px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      `;
      
      this.searchInput.parentElement.style.position = 'relative';
      this.searchInput.parentElement.appendChild(this.suggestions);
    }
  }

  handleSearch(searchTerm) {
    const trimmedTerm = searchTerm.trim().toLowerCase();
    
    if (trimmedTerm.length === 0) {
      this.showRecentSearches();
      return;
    }

    const matchingGames = this.games.filter(game =>
      game.name.toLowerCase().includes(trimmedTerm) ||
      game.category.toLowerCase().includes(trimmedTerm)
    );

    this.updateSuggestions(matchingGames, trimmedTerm);
  }

  handleKeydown(e) {
    const suggestionElements = this.suggestions.querySelectorAll('.suggestion');
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.setActiveSuggestion(Math.min(this.activeSuggestion + 1, suggestionElements.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.setActiveSuggestion(Math.max(this.activeSuggestion - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (this.activeSuggestion >= 0 && suggestionElements[this.activeSuggestion]) {
          const gameData = suggestionElements[this.activeSuggestion].dataset;
          this.selectGame(gameData.name, gameData.id);
        }
        break;
      case 'Escape':
        this.hideSuggestions();
        this.searchInput.blur();
        break;
    }
  }

  updateSuggestions(games, searchTerm = '') {
    this.suggestions.innerHTML = '';
    this.activeSuggestion = -1;

    if (games.length === 0 && searchTerm) {
      const noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.textContent = 'Nenhum jogo encontrado';
      noResults.style.cssText = 'padding: 16px; color: #666; text-align: center;';
      this.suggestions.appendChild(noResults);
    } else {
      games.forEach((game, index) => {
        const suggestion = this.createSuggestionElement(game, searchTerm);
        suggestion.addEventListener('click', () => this.selectGame(game.name, game.id));
        suggestion.addEventListener('mouseenter', () => this.setActiveSuggestion(index));
        this.suggestions.appendChild(suggestion);
      });
    }

    this.suggestions.style.display = 'block';
  }

  createSuggestionElement(game, searchTerm) {
    const suggestion = document.createElement('div');
    suggestion.className = 'suggestion';
    suggestion.dataset.name = game.name;
    suggestion.dataset.id = game.id;
    
    // Highlight matching text
    let displayName = game.name;
    if (searchTerm) {
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      displayName = game.name.replace(regex, '<mark>$1</mark>');
    }
    
    suggestion.innerHTML = `
      <div style="padding: 12px 16px; cursor: pointer; border-bottom: 1px solid #eee;">
        <div style="font-weight: 500; color: #333;">${displayName}</div>
        <div style="font-size: 0.85rem; color: #666; margin-top: 2px;">${game.category}</div>
      </div>
    `;
    
    suggestion.addEventListener('mouseenter', () => {
      suggestion.style.backgroundColor = '#f5f5f5';
    });
    
    suggestion.addEventListener('mouseleave', () => {
      suggestion.style.backgroundColor = '';
    });

    return suggestion;
  }

  setActiveSuggestion(index) {
    const suggestions = this.suggestions.querySelectorAll('.suggestion');
    
    // Remove active class from all suggestions
    suggestions.forEach(s => s.classList.remove('suggestion-active'));
    
    this.activeSuggestion = index;
    
    if (index >= 0 && suggestions[index]) {
      suggestions[index].classList.add('suggestion-active');
      suggestions[index].style.backgroundColor = '#e3f2fd';
    }
  }

  selectGame(gameName, gameId) {
    try {
      // Add to search history
      this.addToSearchHistory(gameName);
      
      // Navigate to game details
      window.location.href = `detalhes.html?gameId=${gameId}`;
    } catch (error) {
      handleError(error, 'selecting game');
    }
  }

  addToSearchHistory(gameName) {
    // Remove if already exists
    this.searchHistory = this.searchHistory.filter(item => item !== gameName);
    
    // Add to beginning
    this.searchHistory.unshift(gameName);
    
    // Keep only last 5 searches
    this.searchHistory = this.searchHistory.slice(0, 5);
    
    // Save to localStorage
    storage.set('searchHistory', this.searchHistory);
  }

  showRecentSearches() {
    if (this.searchHistory.length === 0) {
      this.hideSuggestions();
      return;
    }

    this.suggestions.innerHTML = '';
    
    const header = document.createElement('div');
    header.style.cssText = 'padding: 8px 16px; background: #f8f9fa; font-size: 0.85rem; color: #666; border-bottom: 1px solid #eee;';
    header.textContent = 'Pesquisas recentes';
    this.suggestions.appendChild(header);

    this.searchHistory.forEach(gameName => {
      const game = this.games.find(g => g.name === gameName);
      if (game) {
        const suggestion = this.createSuggestionElement(game, '');
        suggestion.addEventListener('click', () => this.selectGame(game.name, game.id));
        this.suggestions.appendChild(suggestion);
      }
    });

    this.suggestions.style.display = 'block';
  }

  hideSuggestions() {
    this.suggestions.style.display = 'none';
    this.activeSuggestion = -1;
  }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GameSearch();
});