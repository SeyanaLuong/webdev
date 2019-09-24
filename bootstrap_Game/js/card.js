const app = document.getElementById("root");
const nextPage = "https://api.rawg.io/api/games?page=";
const bySize = "&page_size=";
const searchQuery = "&search=";
var pages = 1;
var pageSize = 15;
var searchGame = "";
var request = new XMLHttpRequest();

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
}

var input = document.getElementById("gameTitle");
input.addEventListener("keyup", function(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    document.getElementById("submitBtn").click();
  }
});

function disableBtns(data) {
  var disPrev = document.getElementById("prevBtn");
  var disNext = document.getElementById("nextBtn");
  if (data.previous) {
    disPrev.removeAttribute("disabled");
  } else {
    disPrev.setAttribute("disabled", "");
  }
  if (data.next) {
    disNext.removeAttribute("disabled");
  } else {
    disNext.setAttribute("disabled", "");
  }
  if (data.next) {
    document.getElementById("nextBtn").removeAttribute("disabled");
  }
}

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
  request.onload = function() {
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

        var parseName = game.name;
        console.log(parseName);
        parseName = parseName
          .toLowerCase()
          .replace(/'/g, "")
          .replace(/-/g, "")
          .replace(/[^a-zA-Z0-9]/g, "-");
        parseName = parseName.replace(/--/g, "-");
        console.log(parseName);

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

function getImageCard(game) {
  const img = document.createElement("img");
  img.setAttribute("class", "card-img-top");
  if (game.background_image) {
    img.setAttribute("src", game.background_image);
  } else {
    img.setAttribute("src", "");
  }
  return img;
}

function getPlatformCard(game) {
  var platformConcat = "";
  game.platforms.forEach(x => {
    platformConcat = x.platform.name + ", " + platformConcat;
  });
  platformConcat = platformConcat.substring(0, platformConcat.length - 2);
  const platformName = document.createElement("p");
  platformName.setAttribute("class", "card-text");
  platformName.textContent = "Platform: " + platformConcat;
  return platformName;
}

function getGenreCard(game) {
  var genreConcat = "";
  game.genres.forEach(x => {
    genreConcat = x.name + ", " + genreConcat;
  });
  genreConcat = genreConcat.substring(0, genreConcat.length - 2);
  const genreName = document.createElement("p");
  genreName.setAttribute("class", "card-text");
  genreName.textContent = "Genre: " + genreConcat;
  return genreName;
}

function getReleaseDateCard(game) {
  const releaseDate = document.createElement("p");
  releaseDate.setAttribute("class", "card-text");
  releaseDate.textContent = "Release Date: " + game.released;
  return releaseDate;
}

function getScreenShotsCard(game) {
  const imgGallery = document.createElement("div");
  imgGallery.setAttribute("class", "img-gallery");

  for (var i = 1; i < 3; i++) {
    var imgList = document.createElement("img");
    if (game.short_screenshots[i]) {
      var images = game.short_screenshots[i].image;
    } else {
      var images = "";
    }
    imgList.setAttribute("src", images);
    imgGallery.appendChild(imgList);
  }
  return imgGallery;
}