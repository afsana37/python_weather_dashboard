const history = [];

// Dark Mode Toggle
document.getElementById('dark-mode-toggle').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');

    // Save the user's preference in localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
});

// Load the user's preference on page load
window.addEventListener('load', function () {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
    }
});

document.getElementById('search').addEventListener('click', function () {
    const city = document.getElementById('city').value.trim();

    // Validate input: letters, spaces, hyphens, and apostrophes
    if (!/^[a-zA-Z\s'-]+$/.test(city)) {
        alert('Please enter a valid city name (letters, spaces, hyphens, and apostrophes only).');
        document.getElementById('city').value = ''; // Clear invalid input
        return;
    }

    fetchWeather(city)
        .then((isValid) => {
            if (isValid) {
                fetchForecast(city);
                addToHistory(city);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while fetching weather data.');
        });

    document.getElementById('city').value = '';
    document.getElementById('city').focus();
});

function fetchWeather(city) {
    return fetch(`http://127.0.0.1:5000/weather?city=${encodeURIComponent(city)}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch weather data.');
            }
            return response.json();
        })
        .then((data) => {
            if (data.error) {
                document.getElementById('result').style.display = 'block';
                document.getElementById('result').innerHTML = `<p class="text-danger">${data.error}</p>`;
                return false;
            } else {
                document.getElementById('result').style.display = 'block';
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
                return true;
            }
        })
        .catch((error) => {
            console.error('Error fetching weather:', error);
            document.getElementById('result').style.display = 'block';
            document.getElementById('result').innerHTML = `
                <p class="text-danger">An error occurred: Could not fetch weather data. Please try again.</p>
            `;
            return false;
        });
}

function fetchForecast(city) {
    fetch(`http://127.0.0.1:5000/forecast?city=${encodeURIComponent(city)}`)
        .then((response) => response.json())
        .then((data) => {
            const forecastDiv = document.getElementById('forecast');
            forecastDiv.innerHTML = `<h3>5-Day Forecast for ${data.city}</h3>`;
            data.forecast.forEach((day) => {
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
            history.shift();
        }

        updateHistory();
    }
}

function updateHistory() {
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = '';

    history.forEach((city) => {
        const button = document.createElement('button');
        button.className = 'btn btn-secondary m-1';
        button.textContent = city;

        button.addEventListener('click', () => {
            fetchWeather(city).then((isValid) => {
                if (isValid) fetchForecast(city);
            });
        });

        historyDiv.appendChild(button);
    });
}

document.getElementById('clear-history').addEventListener('click', () => {
    history.length = 0;
    updateHistory();
});
