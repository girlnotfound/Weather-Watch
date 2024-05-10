// create variables for API key and base URL
const apiKey = '348408785b0788ac19a93045becfa9a2'; 
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

// Function to get city coordinates 
function getCityCoordinates(city, apiKey) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},&limit=1&appid=${apiKey}`
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
                getWeatherData(lat, lon, apiKey); // call the weather API function to get the weather data
            }
        });
}

// function to get weather data
function getWeatherData(lat, lon, apiKey) {
    fetch('http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}'

    )
        .then(function(response) {
            return response.json(); // convert to JSON
        })
        .then(function(data) {
             // check if no weather data is available
            if (data.length === 0) {
                alert("Sorry, currently no weather information available.");
            } else {
                // log the forcast weather data to the console
                console.log("Forecast Data:", data);
            }
        });
}

// Function to handle form submission
function handleCitySearch(event) {
    event.preventDefault();
    const city = searchBar.value.trim(); // get the city name from the search bar and remove extra spaces
    if (city) { // check if the search bar is not empty
        getCityCoordinates(city, apiKey); 
        searchBar.value = ''; // clear the search
        }
}

// event listener for form submission
formEl.addEventListener('submit', handleCitySearch);

