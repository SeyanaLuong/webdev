const app = document.getElementById("root");

var apiCards = "https://api.rawg.io/api/games?page_size=50&search=";
var request = new XMLHttpRequest();

var input = document.getElementById("gameTitle");
input.addEventListener("keyup", function(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    document.getElementById("submitBtn").click();
  }
});

function getGameCards() {
    while(app.firstChild){
        app.removeChild(app.firstChild);
    }
    const container = document.createElement("div");
    container.setAttribute("class", "container");
    app.appendChild(container);
  
  
  var gameTitle = document.getElementById("gameTitle").value;
  var gameTitle = gameTitle
    .split(" ")
    .join("%20")
    .split("'")
    .join("")
    .toLowerCase();
  request.open("GET", apiCards + gameTitle, true);
  request.onload = function() {
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      data.results.forEach(game => {
        const card = document.createElement("div");
        card.setAttribute("class", "card");
        container.appendChild(card);

        const img = document.createElement("img");
        img.setAttribute("class", "card-img-top");
        if(game.background_image) {
            img.setAttribute("src", game.background_image);
        } else {
            img.setAttribute("src", "");
        }
        card.appendChild(img);

        const gameTitle = document.createElement("h5");
        gameTitle.setAttribute("class", "card-title");
        gameTitle.textContent = game.name;
        card.appendChild(gameTitle);

        const cardBody = document.createElement("div");
        cardBody.setAttribute("class", "card-body");
        card.appendChild(cardBody);

        var platformConcat = "";
        game.platforms.forEach(x => {
          platformConcat = x.platform.name + ", " + platformConcat;
        });
        platformConcat = platformConcat.substring(0, platformConcat.length - 2);
        const platformName = document.createElement("p");
        platformName.setAttribute("class", "card-text");
        platformName.textContent = "Platform: " + platformConcat;

        var genreConcat = "";
        game.genres.forEach(x => {
          genreConcat = x.name + ", " + genreConcat;
        });
        genreConcat = genreConcat.substring(0, genreConcat.length - 2);
        const genreName = document.createElement("p");
        genreName.setAttribute("class", "card-text");
        genreName.textContent = "Genre: " + genreConcat;

        const releaseDate = document.createElement("p");
        releaseDate.setAttribute("class", "card-text");
        releaseDate.textContent = "Release Date: " + game.released;

        const imgGallery = document.createElement("div");
        imgGallery.setAttribute("class", "img-gallery");

        for(var i = 0; i<3;i++) {
            const imgList = document.createElement("img");
            imgList.setAttribute("src", game.short_screenshots[i].image);
            imgGallery.appendChild(imgList);
        }
        // game.short_screenshots.forEach(x => {
        //   const imgList = document.createElement("img");
        //   imgList.setAttribute("src", x.image);
        //   imgGallery.appendChild(imgList);
        // });
        imgGallery.removeChild(imgGallery.childNodes[0]);

        cardBody.appendChild(genreName);
        cardBody.appendChild(platformName);
        cardBody.appendChild(releaseDate);
        cardBody.appendChild(imgGallery);
      });
    } else if (request.status == 404) {
      alert("Error 404: Game cannot be found.");
    } else {
      console.log("error");
    }
  };
  request.send();
  console.log(app.childNodes);
}
