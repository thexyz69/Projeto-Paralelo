document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get('gameId');

  fetch("infojogos.json")
    .then(response => response.json())
    .then(games => {
      if (gameId && games[gameId]) {
        let game = games[gameId];
        document.getElementById("game-title").innerText = game.title;
        document.getElementById("game-image").src = game.image;
        document.getElementById("video-source").src = game.video;
        document.getElementById("game-video").load();
        document.getElementById("game-description").innerText = game.description;
        document.getElementById("game-rating").innerText = game.rating;
        document.getElementById("game-genre").innerText = game.genre;

       
        let gameLink = document.getElementById("game-link");
        gameLink.innerText = "Link Dos Desenvolvedores";
        gameLink.href = game.link;
        gameLink.target = "_blank"; 
      } else {
        console.error("Jogo não encontrado: " + gameId);
      }
    })
    .catch(error => console.error("Erro ao carregar os dados dos jogos: ", error));
});
