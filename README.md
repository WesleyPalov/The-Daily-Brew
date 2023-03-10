# The Daily Brew

## Live Link:
[The Daily Brew](https://wesleypalov.github.io/The-Daily-Brew/)

## Goal of the App

The intention behind this web application is to build an all-in-one stop for users in the Denver metro area. The user can quickly access the current and future weather, see the current traffic, and see the daily news sorted by category in one quick to read UI. It also allows for the user to save news articles to read later if they don't have time, and check the weather in other locations. Saving their recent searches to access quickly next time the user loads the page. This core values of the application are to be quick, efficient, and allow the user to read the news on their own time and anywhere!

## User Story

    AS a busy person
    I WANT one application that quickly shows information I need for the day
    SO THAT I don’t have to spend a lot of my time getting the information I need   

## Acceptance Criteria

    GIVEN I am a bust commuter
        WHEN I open the applicaiton
        THEN I can see an easy to navigate design
        WHEN I load the application
        THEN I see the current Weather and a 5-day forecast
        WHEN reading the news Section
        THEN I can save specific articles and they presist on the page
        WHEN I load the page
        THEN I can see the current traffic in the denver metro area
        WHEN I search for a city's weather forecast
        THEN it is set in local storage and I can access the info from one button



## Wireframe

![](./assets/Images/Wireframe0.2.png)

## Current Functions
The application is simple to use. The top search bar is designed to allow the user to search for specific cities all around the world and it will pull up the current weather and the 5-day forecast. 

![](./assets/Images/WeatherSearch.png)

The News Article section is designed for the user to quickly see the top 10 news articles pertaining to the topic of world news. The User can then select a specfic topic and show 10 articles that are around or envoled with that topic. 

![](./assets/Images/TopicSelctor.png)

The News section will also allow the user to save articles to be read at a later time if the so choose. Hitting the eye icon, will display the articles saved using the floppydisc icon on each article. 

Saved Articles Section:

![](./assets/Images/SaveIcon.png)     

Saving Button:

  ![](./assets/Images/floppyImage.png)

Lastly, the traffic portion is meant to be a still image that overlays the current traffic information of a given location. 

![](./assets/Images/TrafficStilImage.png)

## Future Functions

    Adding a dark/light mode
        We hope to add user custumization with a personlized dark and light mode
    
    Adding in direct sources
        We hope to allow the user to choose which specific news sources they would like to see. 

    Adding a weather map
        To allow the user to see where around the state weather is forming and where cold/hot fronts are geogrphical on the globe

    Adding reported Accidents
        Reall time updates pertaining to when and where accidents are and the current status of the traffic around a given crash


## API's used

    NewsData.io

[NewsData.io](https://newsdata.io/) allows to pull in the current headlines from multiple news soruces worldwide! It tracks and collects headlines and links to the current articles trending on the web. The [NewsData.io](https://newsdata.io/) has the capablities to serach news articles that have been archived within the last 2 years for a fee.

How we used the API was just to pull in the top 10 current headlines worldwide and allow the user to select a specific genre of news articles. Ranging from anywhere from worldwide to food. We built in a saving feature to our website that will keep the given headline, depsctiprtion, and link of the given data of any artcile. The intention behind this to allow the usere to choose when they would like to read the article and have a quick place to access them for the future.

Overall, [NewsData.io](https://newsdata.io/) is a great API with a free package that will work well for any small projects such as this one. You can even take it further and breakdown the ablity to choose news from specific countries. The documention on their website is really in-depth in how the API works. Showing many more features one could use to refine the users search of News! We would recommend this API for anyone in the future!


    OpenWeather

HTML and CSS and Javascript documents create a weather application
This project emphasizes the use of using an API call and JQuery to make dynamic changes to an HMTL document
This project utilizes the use of appending HTML pages.
AJAX (Asynchronous JavaScript And XML) has been used to communicate with server.

This segment has the following features:.
A Search bar for the city location
A card that provides the current weather \*\* Location, Temp, Humidity, Wind Speed, Feels like, UV Index
A Card that provides a five day forecast

Psuedo code:
Create a search input for customer input
3 API calls for Current Weather, 5-day Forecast and UV Index
3 Separate cards with search history, current weather and 5-day weather
Local storage will save user history
.empty() will clear old info before new info is populated

The weather segment has features of:
3 API calls
Variable declaration area
An event listener (onclick) that receives user input

    Developer.tomtom

[tomtom.com](https://developer.tomtom.com/) allows pulls of map and traffic data worldwide. It tracks traffic flow rates and incident data in real time so that it can be displayed to a user.

How we used the API was to pull in map tiles at a zoom level that allowed us to see all of denver and displayed them in a grid. Then we grabbed traffic flow data and displayed it over the top of the map to show flow rates on the major roads in the Denver area. The intention behind this was to give the user a good overview of the current traffic conditions of the Denver area to help plan their day.

In all, the [tomtom.com](https://developer.tomtom.com/) API is a very useful tool for not just displaying maps, but traffic data and incident reports as well. While the mapping isn't intuitive as the API uses a zoom grid system that can be difficult to figure out, the API explorer more than makes up for it. Being able to test your URLs and experiment within the [tomtom.com](https://developer.tomtom.com/) website was extremely useful, not just with getting the correct tiles but also for learning how the API functions.


## Challenges

As a team, a big challenge we faced was working as a team on the same codebase and desgin. At the start we ran into merge issues with indivuals codes. It would pull from our time to work on given projects as it would lead to group sessions on how to fix the conflict we where having. Towards the end of the project, we found that giving each developer a certain section of lines to work within help avoid a huge majorities of conflicts.

Another issue we ran into was with functions running to quickly and not allowing the local storage to save an actually value. This was causing a huge issue of the codebase breaking and refusing to run as the local storage had a key, value pair with a value of either "null" or "undefinded". It was a hard error to debug as the given error thrown would be about CORS and API server issue. This issue was resloved through trouble shooting each function until the code appeared and seeing where and when the local storage value was set to an incorrect value. 