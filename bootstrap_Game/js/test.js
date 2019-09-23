var api = "https://api.rawg.io/api/games/";
var request = new XMLHttpRequest();

var input = document.getElementById("gameTitle");
input.addEventListener("keyup", function(e) {
    if(e.keyCode === 13) {
        e.preventDefault();
        document.getElementById("submitBtn").click();
    }
});

function getGameData() {
  var gameTitle = document.getElementById("gameTitle").value;
  var gameTitle = gameTitle
    .split(" ")
    .join("")
    .split("'")
    .join("")
    .toLowerCase();
  request.open("GET", api + gameTitle, true);
  request.onload = function() {
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
    //   document.getElementById("gameName").innerHTML = data.name;
      getGameTitle(data);
      getIMG(data);
      getGenre(data);
    //   document.getElementById("gameDescription").innerHTML = data.description;
      getGameDescription(data);
      getMetacritic(data);
    //   document.getElementById("gameReleaseDate").innerHTML =
    //     "Release Date: " + data.released;
    getReleaseDate(data);
      getPlatforms(data);
      getReddit(data);
      getWebsite(data);
    //   document.getElementById("gameWebsite").href = data.website;
    //   document.getElementById("gameWebsite").innerHTML = data.website;
    //   document.getElementById("gameReddit").href = data.reddit_url;
    //   document.getElementById("gameReddit").innerHTML = data.reddit_name;
      getDeveloper(data);
      getPublisher(data);
      getESRB(data);
      document.getElementById("gameDetails").style = "display:flex;";
    } else if (request.status == 404) {
      alert("Error 404: Game cannot be found.");
    } else {
      console.log("error");
    }
  };
  request.send();
}

function getReddit(data) {
    if(data.website) {
        document.getElementById("gameReddit").href = data.reddit_url;
        document.getElementById("gameReddit").innerHTML = data.reddit_name;
    } else {
        document.getElementById("gameReddit").style = "display:none;";
    }
}

function getWebsite(data) {
    if(data.website) {
        document.getElementById("gameWebsite").href = data.website;
        document.getElementById("gameWebsite").innerHTML = data.website;
    } else {
        document.getElementById("gameWebsite").style = "display:none;";
    }
}

function getReleaseDate(data) {
    if(data.released) {
        document.getElementById("gameReleaseDate").innerHTML = "Release Date: " + data.released;
    } else {
        document.getElementById("gameReleaseDate").style = "display:none;";
    }
}
function getGameDescription(data) {
    if(data.description) {
        document.getElementById("gameDescription").innerHTML = data.description;
    } else {
        document.getElementById("gameDescription").style = "display:none;";
    }
}

function getGameTitle(data) {
    if(data.name) {
        document.getElementById("gameName").innerHTML = data.name;
    } else {
        document.getElementById("gameDetails").style = "display:none;";
    }
}

function getESRB(data) {
  if (data.esrb_rating) {
    document.getElementById("ESRB").innerHTML =
      "ESRB Rating: " + data.esrb_rating.name;
  } else {
    document.getElementById("ESRB").style = "display: none";
  }
}

function getIMG(data) {
  if (data.background_image) {
    document.getElementById("gameIMG").src = data.background_image;
  } else {
    document.getElementById("gameIMG").src = "";
  }
}

function getGenre(data) {
  var genreConcat = "";
  data.genres.forEach(x => {
    genreConcat = x.name + ", " + genreConcat;
  });
  genreConcat = genreConcat.substring(0, genreConcat.length - 2);
  document.getElementById("gameGenre").innerHTML = "Genre: " + genreConcat;
}

function getMetacritic(data) {
  var metacriticColor;
  var score = data.metacritic;
  if (!score) {
    metacriticColor = "#000000";
  }
  if (score > 61) {
    metacriticColor = "#66cc33;";
  } else if (score > 40) {
    metacriticColor = "#ffcc33;";
  } else {
    metacriticColor = "#ff0000;";
  }
  document.getElementById("gameMetacritic").innerHTML = score;
  document.getElementById("gameMetacritic").style =
    "padding: 0px; text-align: center; color: #ffffff; background-color: " +
    metacriticColor;
}

function getPlatforms(data) {
  var platformConcat = "";
  data.platforms.forEach(x => {
    platformConcat = x.platform.name + ", " + platformConcat;
  });
  platformConcat = platformConcat.substring(0, platformConcat.length - 2);
  document.getElementById("gamePlatform").innerHTML = "Platforms: " + platformConcat;
}

function getDeveloper(data) {
  var devConcat = "";
  data.developers.forEach(x => {
    devConcat = x.name + ", " + devConcat;
  });
  devConcat = devConcat.substring(0, devConcat.length - 2);
  document.getElementById("gameDeveloper").innerHTML = "Developer: " + devConcat;
}

function getPublisher(data) {
  var pubConcat = "";
  data.publishers.forEach(x => {
    pubConcat = x.name + ", " + pubConcat;
  });
  pubConcat = pubConcat.substring(0, pubConcat.length - 2);
  document.getElementById("gamePublisher").innerHTML = "Publisher: " + pubConcat;
}
