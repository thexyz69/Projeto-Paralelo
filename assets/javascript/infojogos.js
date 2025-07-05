document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get("gameId");

  if (!gameId) {
    console.error("Parâmetro gameId não encontrado na URL.");
    return;
  }

  fetch("/assets/json/infojogos.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro na resposta da rede");
      }
      return response.json();
    })
    .then((games) => {
      if (games[gameId]) {
        let game = games[gameId];
        document.getElementById("game-title").innerText = game.title;
        document.getElementById("game-image").src = game.image;
        document.getElementById("video-source").src = game.video;
        document.getElementById("game-video").load();
        document.getElementById("game-description").innerText =
          game.description;
        document.getElementById("game-rating").innerText = game.rating;
        document.getElementById("game-genre").innerText = game.genre;
        document.getElementById("game-link").href = game.link;
        document.getElementById("game-link").innerText =
          "Link dos Desenvolvedores";
      } else {
        console.error("Jogo não encontrado: " + gameId);
      }
    })
    .catch((error) =>
      console.error("Erro ao carregar os dados dos jogos: ", error)
    );
});
