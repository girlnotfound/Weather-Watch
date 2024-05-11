// create variables for API key and base URL
const apiKey = "deeddd3f4c6c7872ae67649acfc3e05f"; 
const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={apiKey}`;
let city = "";
// create variable to retreive search history from local storage
let searchHistory = JSON.parse(localStorage.getItem("search-history")) || [];
// create variables to reference html elements 
const formEl = document.getElementById('form');
const searchBar = document.getElementById('searchbar');
const dashboardEl = document.getElementById('dashboard');
const cardEl = document.getElementsByClassName('weather-card');
const submitBtn = document.querySelector('#submit-button');
const searchHistoryEl = document.getElementById('search-history');

// function to get city coordinates 
function getCityCoordinates(city, apiKey) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city},&limit=1&appid=${apiKey}`
    )
        .then(function (response) {
            return response.json(); // convert to JSON
        })
        .then(function (data) {
             // check if no data was returned
            if (data.length === 0) {
                alert("Location not found, Please try searching for a city.");
            } else {
                // extract lattitude and longitude
                let lat = data[0].lat; 
                let lon = data[0].lon; 
                getWeatherData(lat, lon, apiKey, city); // call the weather API function to get the weather data
            }
        });
}

// function to get weather data
function getWeatherData(lat, lon, apiKey, city) {
    let currentDate = new Date().toLocaleDateString(); 
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    )
        .then(function(response) {
            return response.json(); // convert to JSON
        })
        .then(function(data) {
             // check if no weather data is available
            if (!data.length === 0) {
                alert("Sorry, currently no weather information available.");
            } else {
                updateDailyWeather(data, city, currentDate); // call the updateDailyWeather function here
                updateDashboard(data); // call the updateDashboard function here
            }
        })
        .catch(function(error) {
            console.error('Error fetching weather data:', error);
            alert('Failed to fetch weather data.');
        });
}

// function to update weather details for the dashboard section
function updateDailyWeather(data, city, currentDate) {
    // check if the weather data exists and if there are forecast entries
    if (data && data.list && data.list.length > 0) {
        const dayData = data.list[0]; // weather data for the first day
        // update city name and current date
        document.getElementById('city-name').textContent = city;
        document.getElementById('current-date').textContent = currentDate;
        // update temperature
        document.getElementById('temp-day-0').textContent = `${dayData.main.temp}\u00B0`;
        // update wind
        document.getElementById('wind-day-0').textContent = `${dayData.wind.speed} mph`;
        // update humidity
        document.getElementById('humidity-day-0').textContent = `${dayData.main.humidity}%`;
    } else {
        // console log error if no weather data is available
        console.error('No weather data available for the daily weather section.');
    }
}

// function to update the weather cards in the forecast section
function updateDashboard(data) {
    // check if forecast data is available
    if (data && data.list && data.list.length > 0) {
        // loop through the first five forecast entries
        for (let index = 0; index < 5; index++) {
            const dayIndex = index + 1; // increment day index

            // update temperature
            const tempElementId = 'temp-day-' + dayIndex; // create temperature element id
            const tempElement = document.getElementById(tempElementId); // find temperature element in HTML
            if (tempElement) { 
                // update temperature text content with degree symbol
                tempElement.textContent = data.list[index].main.temp + '\u00B0'; 
            } 

            // update wind
            const windElementId = 'wind-day-' + dayIndex; // create wind element id
            const windElement = document.getElementById(windElementId);
            if (windElement) {
                windElement.textContent = data.list[index].wind.speed + ' mph';
            } 

            // update humidity
            const humidityElementId = 'humidity-day-' + dayIndex; // create humidity element id
            const humidityElement = document.getElementById(humidityElementId);
            if (humidityElement) {
                humidityElement.textContent = data.list[index].main.humidity + '%';
            } 
        }
    } else {
        console.error('No weather data available to update the dashboard.'); // log error if no weather data found
    }
}

// Function to handle form submission
function handleCitySearch(event) {
    event.preventDefault();
    city = searchBar.value.trim(); // get the city name from the search bar and remove extra spaces
    if (city) { // check if the search bar is not empty
        getCityCoordinates(city, apiKey); 
        searchBar.value = ''; // clear the search
        searchHistory.push(city);
        // store the updated searchHistory in localStorage
        localStorage.setItem('search-history', JSON.stringify(searchHistory));
        // update the search history display
        displaySearch();
        }
}

function displaySearch() {
    // clear the search history element
    searchHistoryEl.innerHTML = "";

    // loop through each city in the search history and create a button for it
    for (let city of searchHistory) {
        // create a button element for the city
        const cityButton = document.createElement('button');
        cityButton.setAttribute('class', 'cityButton'); // add class attribute for styling
        cityButton.textContent = city; // set the text content of the button to the city name
        cityButton.addEventListener('click', function() {
            // call getCityCoordinates function when a city button is clicked
            getCityCoordinates(city, apiKey);
        });
        searchHistoryEl.append(cityButton); // append the city button to the search history element
    }
}

function historySearch(e) {
    const cityName = e.target.textContent;
   getCityCoordinates(cityName);
}

// display search history on page load if there is at least 1 city to display
if (searchHistory.length > 0) {
    displaySearch();
}

// event listeners
formEl.addEventListener('submit', handleCitySearch);
searchHistoryEl.addEventListener('click', historySearch);