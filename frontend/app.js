const history = [];

document.getElementById('search').addEventListener('click', function () {
    const city = document.getElementById('city').value;
    if (!city) {
        alert('Please enter a city name.');
        return;
    }

    fetchWeather(city);
    fetchForecast(city);
    addToHistory(city);
});

function fetchWeather(city) {
    fetch(`http://127.0.0.1:5000/weather?city=${city}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('result').innerHTML = `<p class="text-danger">${data.error}</p>`;
            } else {
                document.getElementById('result').innerHTML = `
                    <h3>${data.city}</h3>
                    <img src="http://openweathermap.org/img/wn/${data.icon}@2x.png" alt="Weather icon">
                    <p>Temperature: ${data.temperature}</p>
                    <p>Feels Like: ${data.feels_like}</p>
                    <p>Condition: ${data.condition}</p>
                    <p>Wind Speed: ${data.wind_speed}</p>
                    <p>Humidity: ${data.humidity}</p>
                    <p>Sunrise: ${data.sunrise}</p>
                    <p>Sunset: ${data.sunset}</p>
                `;
            }
        });
}

function fetchForecast(city) {
    fetch(`http://127.0.0.1:5000/forecast?city=${city}`)
        .then(response => response.json())
        .then(data => {
            const forecastDiv = document.getElementById('forecast');
            forecastDiv.innerHTML = `<h3>5-Day Forecast for ${data.city}</h3>`;
            data.forecast.forEach(day => {
                forecastDiv.innerHTML += `
                    <div class="d-inline-block text-center p-3 m-2 border rounded">
                        <p><strong>${day.date}</strong></p>
                        <img src="http://openweathermap.org/img/wn/${day.icon}@2x.png" alt="Weather icon">
                        <p>${day.temperature}</p>
                        <p>${day.condition}</p>
                    </div>
                `;
            });
        });
}

function addToHistory(city) {
    if (!history.includes(city)) {
        history.push(city);
        if (history.length > 5) {
            history.shift(); // Limit to 5 recent searches
        }
        updateHistory();
    }
}

function updateHistory() {
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = '';
    history.forEach(city => {
        const button = document.createElement('button');
        button.className = 'btn btn-secondary m-1';
        button.textContent = city;
        button.addEventListener('click', () => {
            fetchWeather(city);
            fetchForecast(city);
        });
        historyDiv.appendChild(button);
    });
}

document.getElementById('clear-history').addEventListener('click', () => {
    history.length = 0;
    updateHistory();
});
