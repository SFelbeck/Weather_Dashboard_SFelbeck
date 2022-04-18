// so many variables for all the html elements
var searchBtn = document.getElementById("search-btn");
var searchHistory = document.getElementById("search-history");
var searchResults = document.getElementById("search-results");
var weatherState = document.getElementById("weatherState")
var temp = document.getElementById("temp");
var wind = document.getElementById("wind");
var humidity = document.getElementById("humidity");
var uvIndex = document.getElementById("uv-index");
var day1 = document.getElementById("day1");
var day2 = document.getElementById("day2");
var day3 = document.getElementById("day3");
var day4 = document.getElementById("day4");
var day5 = document.getElementById("day5");

// variable for the current date
var currentDate = moment().format("MMMM Do YYYY");

// calls the function to update all the weather info
searchBtn.addEventListener("click", function () {
    let city = document.querySelector('#search-input').value;
    callApi(city);
})


function callApi(city) {
    //calls the api with my new api key
    
    const apiCall= `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=44642fc0cba2290a3a6af2d7638e70d4&units=metric`;

    // fetches the api
    fetch(apiCall)
    .then(function (response) {
        return response.json();
        
    })

    .then (function (data){
        var cityArray = JSON.parse(localStorage.getItem('city')) || [];
        cityArray.push(data.name);

        // a second api fetch because only this version has the uv index which is fundamentally weird to me but it works
        var uvApi = `https://api.openweathermap.org/data/2.5/onecall?lat=` + data.coord.lat + `&lon=` + data.coord.lon + `&appid=44642fc0cba2290a3a6af2d7638e70d4&units=metric`
        fetch(uvApi)
        .then(function (response2) {
            return response2.json();
        })

        .then(function(moreData){
        //saves city to localstorage for later use and calls renderBtn
        localStorage.setItem("city", JSON.stringify(cityArray))
        renderBtn(data.name);
        // everything from here displays the weather info
        document.querySelector('.cityWeatherInfo').textContent = data.name + " " + currentDate;
        // generates an icon of the weather, in its current state this leaves a blank picture on the application before a city is searched but I ran out of time to implement the css to fix this issue
        document.querySelector('.weatherState').setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
        // metric measurements are far superior to imperial measurements anyways
        temp.textContent = "Temp: " + data.main.temp + " celsius";
        wind.textContent = "Wind: " + data.wind.speed + " mph";
        // This literally did not work until I added the percentage at the end ????
        humidity.textContent = "Humidity: " + data.main.humidity + " %";
        uvIndex.textContent = "UV Index: " + moreData.current.uvi;
        // makes the uvi change color depending on amount of sunlight
        if(moreData.current.uvi < 3){
            uvIndex.style.background = "green";
        }else if(moreData.current.uvi >= 3 && moreData.current.uvi > 6){
            uvIndex.style.background = "yellow";
        }else if(moreData.current.uvi >= 6 && moreData.current.uvi > 8){
            uvIndex.style.background = "orange";
        }else{
            uvIndex.style.background = "red";
        }

        // I know there isnt an icon for these but I couldnt figure out how to do a loop for this
        // Updates weather information for the 5 day forecast cards
        day1.textContent = city + " " + moment().add(1, 'day').format("MMMM Do YYYY") + " Clouds: " + moreData.daily[1].clouds + " Temp: " + moreData.daily[1].temp.day + "c Wind: " + moreData.daily[1].wind_speed + "mph";

        day2.textContent = city + " " + moment().add(2, 'day').format("MMMM Do YYYY") + " Clouds: " + moreData.daily[2].clouds + " Temp: " + moreData.daily[2].temp.day + "c Wind: " + moreData.daily[2].wind_speed + "mph";

        day3.textContent = city + " " + moment().add(3, 'day').format("MMMM Do YYYY") + " Clouds: " + moreData.daily[3].clouds + " Temp: " + moreData.daily[3].temp.day + "c Wind: " + moreData.daily[3].wind_speed + "mph";

        day4.textContent = city + " " + moment().add(4, 'day').format("MMMM Do YYYY") + " Clouds: " + moreData.daily[4].clouds + " Temp: " + moreData.daily[4].temp.day + "c Wind: " + moreData.daily[4].wind_speed + "mph";

        day5.textContent = city + " " + moment().add(5, 'day').format("MMMM Do YYYY") + " Clouds: " + moreData.daily[5].clouds + " Temp: " + moreData.daily[5].temp.day + "c Wind: " + moreData.daily[5].wind_speed + "mph";

        })
    })
}
// an array that holds previous searches that were stored in localstorage
var cityArray = JSON.parse(localStorage.getItem('city')) || [];
// creates a new button that would save previous searches and assigns them classes and values
function renderBtn(text){
    var newBtn = document.createElement("button");
    newBtn.textContent = text;
    searchHistory.append(newBtn);
    newBtn.classList.add("newBtn");
    newBtn.setAttribute("value", text)
}
//loops through created buttons to ensure they have the correct localstorage value
for (let i = 0; i < cityArray.length; i++) {
    renderBtn(cityArray[i]);
}
 // calls the callApi function with the value of the saved button
        $(".newBtn").on("click", function(){
            callApi($(this).val());
        })