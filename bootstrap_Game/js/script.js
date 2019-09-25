const api = "https://api.rawg.io/api/games/";
const request = new XMLHttpRequest();
var getUrl = window.location.href;
var url = new URL(getUrl);
var gameTitle = url.searchParams.get("q");
var page = url.searchParams.get("p");
var page_size = url.searchParams.get("s");
var search = url.searchParams.get("g");
getGameData();

function backButton() {
  window.location = `index.html?p=${page}&s=${page_size}&g=${search}`;
}

function getGameData() {
  request.open("GET", api + gameTitle, true);
  request.onload = function () {
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      getGameTitle(data);
      getIMG(data);
      getGenre(data);
      getGameDescription(data);
      getMetacritic(data);
      getReleaseDate(data);
      getPlatforms(data);
      getReddit(data);
      getWebsite(data);
      getDeveloper(data);
      getPublisher(data);
      getESRB(data);
      document.getElementById("gameDetails").style = "display: flex;";
    } else if (request.status == 404) {
      alert("Error 404: Game cannot be found.");
    } else {
      console.log("error");
    }
  };
  request.send();
}