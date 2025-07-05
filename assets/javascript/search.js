const games = [
  "Stardew Valley",
  "Red Dead 2",
  "Baldurs Gate",
  "Valorant",
  "Alien Isolation",
  "Out last",
  "God Of War",
  "The Last Of Us Part 2",
  "Euro Truck Simulator",
  "Goat Simulator",
  "Grand Theft Auto V",
  "Elden Ring",
];

const gameRedirects = {
  "Stardew Valley": "jogo01",
  "Red Dead 2": "jogo02",
  "Baldurs Gate": "jogo03",
  Valorant: "jogo04",
  "Alien Isolation": "jogo05",
  "Out last": "jogo06",
  "God Of War": "jogo07",
  "The Last Of Us Part 2": "jogo08",
  "Euro Truck Simulator": "jogo09",
  "Goat Simulator": "jogo10",
  "Grand Theft Auto V": "jogo11",
  "Elden Ring": "jogo12",
};

const searchInput = document.getElementById("searchInput");
const suggestions = document.getElementById("suggestions");
let activeSuggestion = -1;

// Event listener para entrada de texto
searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const matchingGames = games.filter((game) =>
    game.toLowerCase().includes(searchTerm)
  );

  // Atualiza as sugestões existentes
  updateSuggestions(matchingGames);
});

// Event listener para teclas pressionadas
searchInput.addEventListener("keydown", function (e) {
  const suggestionsList = document.querySelectorAll(".suggestion");

  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    const direction = e.key === "ArrowDown" ? 1 : -1;
    setActiveSuggestion(activeSuggestion + direction);
  } else if (e.key === "Enter" && activeSuggestion !== -1) {
    const suggestedGame = suggestionsList[activeSuggestion].textContent;
    redirectToGameDetails(suggestedGame);
  }
});

// Função para atualizar sugestões na interface
function updateSuggestions(matchingGames) {
  suggestions.innerHTML = ""; // Limpa sugestões anteriores

  matchingGames.forEach((game, index) => {
    const suggestion = document.createElement("div");
    suggestion.classList.add("suggestion");
    suggestion.textContent = game;
    suggestion.addEventListener("click", function () {
      redirectToGameDetails(game);
    });
    suggestion.addEventListener("mouseover", function () {
      setActiveSuggestion(index);
    });
    suggestions.appendChild(suggestion);
  });

  suggestions.style.display = matchingGames.length > 0 ? "block" : "none";
  activeSuggestion = -1; // Reseta sugestão ativa ao digitar
}

// Função para definir sugestão ativa
function setActiveSuggestion(index) {
  const suggestionsList = document.querySelectorAll(".suggestion");
  const maxIndex = suggestionsList.length - 1;

  if (index > maxIndex) {
    index = 0; // Volta para o primeiro item
  } else if (index < 0) {
    index = maxIndex; // Vai para o último item
  }

  suggestionsList.forEach((suggestion) => {
    suggestion.classList.remove("suggestion-active");
  });

  suggestionsList[index].classList.add("suggestion-active");
  activeSuggestion = index;
}

// Função para redirecionar para os detalhes do jogo
function redirectToGameDetails(gameName) {
  const gameId = gameRedirects[gameName];
  if (gameId) {
    window.location.href = `detalhes.html?gameId=${gameId}`;
  } else {
    alert("Jogo não encontrado!");
  }
}
