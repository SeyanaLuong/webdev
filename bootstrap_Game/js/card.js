const app = document.getElementById("root");
const nextPage = "https://api.rawg.io/api/games?page=";
const bySize = "&page_size=";
const searchQuery = "&search=";
const request = new XMLHttpRequest();
var pages = 1;
var pageSize = 15;
var searchGame = "";
var displayOnce = false;
var getUrl = window.location.href;
var url = new URL(getUrl);
var page = url.searchParams.get("p");
var page_size = url.searchParams.get("s");
var search = url.searchParams.get("g");

if (page) {
  pages = page;
  pageSize = page_size;
  searchGame = search;
  getGameCards(page, page_size, search);
} else if (!displayOnce) {
  getGameCards();
}

var input = document.getElementById("gameTitle");
input.addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    document.getElementById("submitBtn").click();
  }
});

function getGameCards(pagesNo, page_size, search) {
  if (!pagesNo) {
    pages = 1;
  }
  while (app.firstChild) {
    app.removeChild(app.firstChild);
  }
  const container = document.createElement("div");
  container.setAttribute("class", "container");
  app.appendChild(container);
  var gameName = document.getElementById("gameTitle").value;
  gameName = gameName
    .split(" ")
    .join("%20")
    .toLowerCase();
  request.open(
    "GET",
    nextPage +
    (pagesNo || pages || 1) +
    bySize +
    (page_size || pageSize) +
    searchQuery +
    (search || gameName),
    true
  );
  request.onload = function () {
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      data.results.forEach(game => {
        disableBtns(data);

        const card = document.createElement("div");
        card.setAttribute("class", "card");

        const gameTitle = document.createElement("h5");
        gameTitle.setAttribute("class", "card-title");
        gameTitle.setAttribute("id", "name");
        gameTitle.textContent = game.name;

        const cardBody = document.createElement("div");
        cardBody.setAttribute("class", "card-body");

        const parseName = game.slug;
        card.onclick = function moreInfo() {
          window.location = `gameInfo.html?q=${parseName}&p=${pages ||
            pagesNo}&s=${pageSize || page_size}&g=${gameName || search || ""}`;
        };

        container.appendChild(card);
        card.appendChild(gameTitle);
        card.appendChild(getImageCard(game));
        card.appendChild(cardBody);
        cardBody.appendChild(getGenreCard(game));
        cardBody.appendChild(getPlatformCard(game));
        cardBody.appendChild(getReleaseDateCard(game));
        cardBody.appendChild(getScreenShotsCard(game));
      });
    } else if (request.status == 404) {
      alert("Error 404: Game cannot be found.");
    } else {
      console.log("error");
    }
  };
  request.send();
}

function toNextPage() {
  pages++;
  getGameCards(pages, pageSize, searchGame);
}

function toPrevPage() {
  pages--;
  getGameCards(pages, pageSize, searchGame);
}