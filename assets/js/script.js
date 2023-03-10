$(window).on("load", function () {
  // makes sure the whole site is loaded
  $("#status").fadeOut(); // will first fade out the loading animation
  $("#preloader").delay(350).fadeOut("slow"); // will fade out the white DIV that covers the website.
  $("body").delay(350).css({ overflow: "visible" });
});
// Easy access to elements
var searchHistoryList = $("#search-history-list");
var searchCityInput = $("#search-city");
var searchCityButton = $("#search-city-button");
var clearHistoryButton = $("#clear-history");
var currentCity = $("#current-city");
var todaysData = $("#todaysData");
var currentTemp = $("#current-temp");
var currentHumidity = $("#current-humidity");
var currentWindSpeed = $("#current-wind-speed");
var currentFeels = $("#current-feels");
var UVindex = $("#uv-index");
var fiveDays = $("#cardContainer");
// storing local storage
var locStor = [];
// Get access to the OpenWeather API
var urlWeather = "https://api.openweathermap.org/data/2.5/weather?q=";
var APIkey = "5806b5e472a87f66457f7aa46221f33b";

timeInterval = setInterval(function () {
  var currentDate = moment().format("dddd MMM Do hh:mm a");
  $("#current-date").text(currentDate);
}, 6000);

// Listens to the click on search button
$("#searchForm").submit(function (event) {
  event.preventDefault();
  var searchValue = searchCityInput.val().trim();
  searchValue = capitalize(searchValue);

  currentWeatherRequest(searchValue);
});

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// This function gets info from openweather.com and returns data needed
function currentWeatherRequest(searchValue) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    searchValue +
    "&units=imperial&appid=" +
    APIkey;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    if (response) {
      if (!($.inArray(searchValue, locStor) > -1)) {
        locStor.unshift(searchValue);
        toLocalStore();
      }
      renderCities();

      currentCity.text(response.name);
      currentCity.append(
        "<img src='https://openweathermap.org/img/w/" +
          response.weather[0].icon +
          ".png' alt='" +
          response.weather[0].main +
          " ' />"
      );

      // Current Weather
      $("#todaysData").empty();
      todaysData.append(`
      <p class="mb-0" id="current-temp">Temperature: ${response.main.temp}&deg;F</p>
      <p class="mb-0" id="current-humidity">Humidity: ${response.main.humidity}%</p>
      <p class="mb-0" id="current-wind-speed">Wind Speed: ${response.wind.speed} MPH</p>
      <p class="mb-0" id="current-feels">Feels like: ${response.main.feels_like}&deg;F</p>
      `);

      var weather = response.weather[0].description;
      if (weather.includes("thunderstorm")) {
        $(".weatherGif").attr(
          "src",
          "https://technical.ly/wp-content/uploads/2020/11/catlightning.gif"
        );
      } else if (weather.includes("rain")) {
        $(".weatherGif").attr(
          "src",
          "https://media.tenor.com/AmmW05QDA50AAAAM/rain-dreary.gif"
        );
      } else if (weather.includes("snow")) {
        $(".weatherGif").attr(
          "src",
          "https://media.tenor.com/CcP4jLLCUsMAAAAM/cat-kitty.gif"
        );
      } else if (weather.includes("clear")) {
        $(".weatherGif").attr(
          "src",
          "https://media.tenor.com/HpXBnJvuA80AAAAC/bask-in-the-sun-cat.gif"
        );
      } else if (weather.includes("clouds")) {
        $(".weatherGif").attr(
          "src",
          "https://media.tenor.com/hoEWP9LL0lkAAAAM/cat-smoke.gif"
        );
      } else if (weather.includes("mist")) {
        $(".weatherGif").attr(
          "src",
          "https://i.pinimg.com/originals/59/05/00/590500ec2b1a24f4d0c6652c58813994.gif"
        );
      } else {
        $(".weatherGif").attr(
          "src",
          "https://static.wikia.nocookie.net/battle-cats/images/b/bf/Catornadoattack.gif/revision/latest?cb=20210810125957"
        );
      }

      // AJAX Call for UV index
      var lat = response.coord.lat;
      var lon = response.coord.lon;
      var UVurl =
        "https://api.openweathermap.org/data/2.5/uvi?&lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        APIkey;
      $.ajax({
        url: UVurl,
        method: "GET",
      }).then(function (response) {
        todaysData.append(`
        <p class="mb-0" id="uv-index">UV index: ${response.value}</p>
      `);
      });

      // Forecast Weather
      var forecastURL =
        "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=" +
        APIkey +
        "&lat=" +
        lat +
        "&lon=" +
        lon;
      // beginning of 5 days forecast
      $("#cardContainer").empty();
      $.ajax({
        url: forecastURL,
        method: "GET",
      }).then(function (response) {
        // console.log(response.list);
        for (var i = 1; i < response.list.length; i += 8) {
          var forecastDateString = moment(response.list[i].dt_txt).format(
            "ddd Do"
          );
          var tempForcast = response.list[i].main.temp;
          var humForcast = response.list[i].main.humidity;
          var windForcast = response.list[i].wind.speed;
          var cardTemplate = $("<div>");
          // cardTemplate.addClass("col-2");
          cardTemplate.append(`
            <div class="card">
                <div class="card-body">
                  <div class="card-header">
                    <h6 class="card-title">${forecastDateString}</h6>
                    <img src='https://openweathermap.org/img/w/${response.list[i].weather[0].icon}.png' alt='${response.list[i].weather[0].main}' class="forecastIcon"/>
                  </div>
                  <p class="card-text">Temp: ${tempForcast}&deg;F</p>
                  <p class="card-text">Humidity: ${humForcast}%</p>
                  <p class="card-text">Wind: ${windForcast}MPH</p>
                </div>
            </div>
                `);
          fiveDays.append(cardTemplate);
        }
      });
    }
    $(document).ajaxError(function () {
      currentCity.text("Invalid City Name");
      $("#todaysData").empty();
      $("#cardContainer").empty();
    });
    // end of 5 days forecast
  });
}

// saves city name to the local storage
function toLocalStore() {
  localStorage.setItem("cityName", JSON.stringify(locStor));
}

// extracts city name from local storage
function fromLocalStore() {
  var arr = localStorage.getItem("cityName");
  if (arr) {
    locStor = JSON.parse(arr);
  } else {
    locstor = [];
  }
}

// Dynamically creates list of saved cities
function renderCities() {
  toLocalStore();
  var tempTop =
    '<button class="btn btn-info city-btn cityButtons"  type="button">';
  var tempBut = "</button>";
  searchHistoryList.empty();

  for (let i = 0; i < locStor.length; i++) {
    var city = locStor[i];
    var finalTem = tempTop + city + tempBut;
    searchHistoryList.prepend(finalTem);
  }
}

clearHistoryButton.on("click", function () {
  locStor = [];
  renderCities();
});

// Clicking on a button in the search history sidebar
// will populate the dashboard with info on that city
searchHistoryList.on("click", ".city-btn", function (event) {
  var value = event.target.innerText;
  currentWeatherRequest(value);
});

fromLocalStore();
renderCities();
currentWeatherRequest("Denver");

//end of Wesley's code

//Michael's CodeBase (News Article Section)
//GLOBAL VARIBLES
var newsArticles = $(".newsArticles");
var savedArticles = $(".savedLinks");
var savedNewsArray = JSON.parse(localStorage.getItem("savedArticles")) || [];
var showingSave = 0;
var category = $("#category").val("World");
var loaderDiv = $(".loader");

//FUNCTIONS

function showLoader() {
  loaderDiv.css("display", "block");
}

function hideLoader() {
  loaderDiv.css("display", "none");
}

function getCategory() {
  category = $("#category option:selected").val(); //Grabs user's selection
  var savedSelection = category;
  localStorage.setItem("savedSelection", JSON.stringify(savedSelection));
  //var set to api's url and attaches the users option to select type of news
  var requestUrlNews =
    "https://newsdata.io/api/1/news?apikey=pub_1779788a92e2df5eda746f4b28c993bb9c4cc&country=us&category=" +
    category;
  //saves selected category to local storage
  localStorage.setItem("lastCategory", JSON.stringify(requestUrlNews));
  //passes the custom url to getNewsApi Function
  getNewsApi(requestUrlNews);
}

function getNewsApi(requestUrlNews) {
  newsArticles.empty();
  showLoader();
  fetch(requestUrlNews) // takes passed url and calls a response to news server
    .then(function (response) {
      //sets response to array

      return response.json();
    })
    .then(function (data) {
      //for loop to take the data and push to function printResults and calls it for based off the length of the data
      for (var i = 0; i < data.results.length; i++) {
        printResults(data.results[i]);
      }

      // event lisenter method set to the savebtns in articles
      $(".saveBtn").on("click", function () {
        //sets the btn to listen to specific article
        var clickBtn = $(this);
        //sets to the inner html of each article
        var savedArticle = clickBtn.parent().children().html();
        //pushes innerHTML to empty array
        savedNewsArray.push(savedArticle);
        //saves new array to localstorage everytime  btn is pushed
        localStorage.setItem("savedArticles", JSON.stringify(savedNewsArray));
      });
      hideLoader();
    });
}

function printResults(resultObj) {
  //builds new div element
  var newsCard = $("<div></div>");
  //sets class values to newly mad div
  newsCard.addClass("bg-light text-dark mb-3 p-3 newsCardStyle");

  var newsBody = $("<div></div>");
  newsBody.addClass("newsBody");
  //appends newsBody to newsCard
  newsCard.append(newsBody);

  var yNewsBox = $("<div></div>");
  yNewsBox.addClass("yNewsBoxStyle");
  newsBody.append(yNewsBox);

  //builds h3 element
  var newsTitle = $("<h3></h3>");
  //sets h3 text to data title
  newsTitle.text(resultObj.title);

  //builds p element
  var bodyContentNews = $("<p></p>");
  //sets p text to string with depscription and date
  bodyContentNews.html(
    "<strong>Date:</strong>" +
      resultObj.pubDate.slice(0, -8) + //removes the last 8 characters of the string
      "<br/> <strong>Description: </strong>" +
      resultObj.description +
      " "
  );

  //builds a tags
  var linkNewsArticle = $("<a></a>");
  linkNewsArticle.text("Read More");
  linkNewsArticle.attr("href", resultObj.link);
  // linkNewsArticle.addClass("btn-dark");

  //builds the save btn and sets the icon
  var newSaveButton = $(
    '<button class="iconButton saveBtn" type="Button"> <i class="fa-solid fa-floppy-disk insideButton"></i> </button>'
  );

  //appends built custom div
  bodyContentNews.append(linkNewsArticle);
  yNewsBox.append(newsTitle, bodyContentNews);
  newsBody.append(yNewsBox, newSaveButton);

  //appends built div to the DOM
  newsArticles.append(newsCard);

  //sets a scrolling box for the news divs
  newsArticles.css({
    overflow: "scroll",
    width: "100%",
    height: "500px",
    "border-radius": "25px",
    padding: "25px",
  });
}

function printSavedResults(savedObj) {
  var savedCard = $("<div></div>");
  savedCard.addClass("bg-light text-dark mb-3 p-3 newsCardStyle");

  //takes passed object sets the innerHTML of savedCard
  savedCard.html(savedObj);

  //appends savedCard to DOM
  savedArticles.append(savedCard);

  savedArticles.css({
    overflow: "scroll",
    height: "500px",
    "border-radius": "25px",
    padding: "25px",
  });
}

//gets the saved catergory from users last load/refresh
getNewsApi(JSON.parse(localStorage.getItem("lastCategory")));

//EVENT LISTNERS

$("#showSavesButton").on("click", function () {
  //if statement to check the global var
  if (showingSave === 0) {
    //stlyes the class object saved Articles if the value of showingSave is 0
    savedArticles.css("display", "block");
    $("#clearNewsSavesButton").css("display", "flex");
    newsArticles.css("display", "none");
    $("#newsHeader h2").text("Saved Articles");
    $("#newsDropDown").css("display", "none");

    showingSave++;
  } else {
    //stlyes the class object saved Articles if the value of showingSave is 1
    savedArticles.css("display", "none");
    $("#clearNewsSavesButton").css("display", "none");
    newsArticles.css("display", "block");
    $("#newsHeader h2").text("News Articles");
    $("#newsDropDown").css("display", "block");
    showingSave--;
  }

  savedArticles.empty();
  //for to run for the length of global array and calls function printSavedResults
  for (var i = 0; i < savedNewsArray.length; i++) {
    printSavedResults(savedNewsArray[i]);
  }
});

getCategory();

$("#clearNewsSavesButton").on("click", function () {
  //empties the div
  savedArticles.empty();
  //empties the array and resets the localstorage
  savedNewsArray = [];
  localStorage.removeItem("savedArticles", []);
});

$("#category").on("change", getCategory);

// Thomas' codeBase
//base url and key for the tomtom api.
var mapKey =
  ".png?tileSize=256&view=Unified&language=NGT&key=s7oWBNNhwPyZDk4QnaRtZ9orhOFiKZOM";
var tileFetchUrl = "https://api.tomtom.com/map/1/tile/basic/main/12/";
//convenience variables to create URLs to fetch appropriate map tiles.
var tileTL = tileFetchUrl + "852/1553" + mapKey;
var tileTM = tileFetchUrl + "853/1553" + mapKey;
var tileTR = tileFetchUrl + "854/1553" + mapKey;
var tileML = tileFetchUrl + "852/1554" + mapKey;
var tileMM = tileFetchUrl + "853/1554" + mapKey;
var tileMR = tileFetchUrl + "854/1554" + mapKey;
var tileBL = tileFetchUrl + "852/1555" + mapKey;
var tileBM = tileFetchUrl + "853/1555" + mapKey;
var tileBR = tileFetchUrl + "854/1555" + mapKey;
var mapContainerEl = document.querySelector("#mapContainerPart2");
var trafficContainerEl = document.querySelector("#trafficContainer");
//convenience variables to create URLSs to fetch appropriate traffic tiles.
var trafficFetchUrl =
  "https://api.tomtom.com/traffic/map/4/tile/flow/relative0/12/";
var trafficTL = trafficFetchUrl + "852/1553" + mapKey;
var trafficTM = trafficFetchUrl + "853/1553" + mapKey;
var trafficTR = trafficFetchUrl + "854/1553" + mapKey;
var trafficML = trafficFetchUrl + "852/1554" + mapKey;
var trafficMM = trafficFetchUrl + "853/1554" + mapKey;
var trafficMR = trafficFetchUrl + "854/1554" + mapKey;
var trafficBL = trafficFetchUrl + "852/1555" + mapKey;
var trafficBM = trafficFetchUrl + "853/1555" + mapKey;
var trafficBR = trafficFetchUrl + "854/1555" + mapKey;

//fetch function that grabs the specific tiles needed to display the Denver Metro area.
function fetchMapTile(tileUrl) {
  fetch(tileUrl)
    .then(function (response) {
      return response;
    })
    .then(function (data) {
      console.log(data);
      var mapTile = document.createElement("img");
      mapTile.setAttribute("src", data.url);
      mapContainerEl.appendChild(mapTile);
    });
}

//Sleep function to pause between functions to make sure they fully load. Credit to James Hibbard of site point.
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

//fetching the specific tiles of denver and waiting so that tiles load in the correct order.
function fetchWholeMap() {
  fetchMapTile(tileTL);
  sleep(500);
  fetchMapTile(tileTM);
  sleep(500);
  fetchMapTile(tileTR);
  sleep(500);
  fetchMapTile(tileML);
  sleep(500);
  fetchMapTile(tileMM);
  sleep(500);
  fetchMapTile(tileMR);
  sleep(500);
  fetchMapTile(tileBL);
  sleep(500);
  fetchMapTile(tileBM);
  sleep(500);
  fetchMapTile(tileBR);
}

fetchWholeMap();

//The next 9 functions call the traffic tiles and assign them classes to be displayed over the top of the map.
fetch(trafficTL)
  .then(function (response) {
    return response;
  })
  .then(function (data) {
    var mapTile = document.createElement("img");
    mapTile.setAttribute("src", data.url);
    mapTile.classList.add("overlayTrafficTL");
    mapContainerEl.appendChild(mapTile);
  });

fetch(trafficTM)
  .then(function (response) {
    return response;
  })
  .then(function (data) {
    var mapTile = document.createElement("img");
    mapTile.setAttribute("src", data.url);
    mapTile.classList.add("overlayTrafficTM");
    mapContainerEl.appendChild(mapTile);
  });

fetch(trafficTR)
  .then(function (response) {
    return response;
  })
  .then(function (data) {
    var mapTile = document.createElement("img");
    mapTile.setAttribute("src", data.url);
    mapTile.classList.add("overlayTrafficTR");
    mapContainerEl.appendChild(mapTile);
  });

fetch(trafficML)
  .then(function (response) {
    return response;
  })
  .then(function (data) {
    var mapTile = document.createElement("img");
    mapTile.setAttribute("src", data.url);
    mapTile.classList.add("overlayTrafficML");
    mapContainerEl.appendChild(mapTile);
  });

fetch(trafficMM)
  .then(function (response) {
    return response;
  })
  .then(function (data) {
    var mapTile = document.createElement("img");
    mapTile.setAttribute("src", data.url);
    mapTile.classList.add("overlayTrafficMM");
    mapContainerEl.appendChild(mapTile);
  });

fetch(trafficMR)
  .then(function (response) {
    return response;
  })
  .then(function (data) {
    var mapTile = document.createElement("img");
    mapTile.setAttribute("src", data.url);
    mapTile.classList.add("overlayTrafficMR");
    mapContainerEl.appendChild(mapTile);
  });

fetch(trafficBL)
  .then(function (response) {
    return response;
  })
  .then(function (data) {
    var mapTile = document.createElement("img");
    mapTile.setAttribute("src", data.url);
    mapTile.classList.add("overlayTrafficBL");
    mapContainerEl.appendChild(mapTile);
  });

fetch(trafficBM)
  .then(function (response) {
    return response;
  })
  .then(function (data) {
    var mapTile = document.createElement("img");
    mapTile.setAttribute("src", data.url);
    mapTile.classList.add("overlayTrafficBM");
    mapContainerEl.appendChild(mapTile);
  });

fetch(trafficBR)
  .then(function (response) {
    return response;
  })
  .then(function (data) {
    var mapTile = document.createElement("img");
    mapTile.setAttribute("src", data.url);
    mapTile.classList.add("overlayTrafficBR");
    mapContainerEl.appendChild(mapTile);
  });
