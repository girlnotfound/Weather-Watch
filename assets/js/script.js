// create variables for API key and base URL
const apiKey = '348408785b0788ac19a93045becfa9a2'; 
const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={APIKey}';
let city = "";
// create variable to retreive history from local storage
let searchHistory = JSON.parse(localStorage.getItem("search-history")) || [];
// create variables to reference html elements 
const formEl = document.getElementById('form');
const searchBar = document.getElementById('searchbar');
const dashboardEl = document.getElementById('dashboard');
const cardEl = document.getElementsByClassName('weather-card');
const submitBtn = document.querySelector('#submit-button');
