const history = [];

document.getElementById('search').addEventListener('click', function () {
    const city = document.getElementById('city').value;
    const resultBox = document.getElementById('result');

    if (!city) {
        resultBox.style.display = 'none';
        alert('Please enter a city name.');
        return;
    }

    resultBox.style.display = 'block';
    resultBox.innerHTML = '<p>Loading...</p>';

    fetch(`http://127.0.0.1:5000/weather?city=${city}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch weather data.');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                resultBox.innerHTML = `<p style="color: red;">${data.error}</p>`;
            } else {
                const tempC = parseFloat(data.temperature.replace("°C", ""));
                const tempF = (tempC * 9 / 5 + 32).toFixed(2);

                resultBox.innerHTML = `
                    <h3>Weather in ${data.city}</h3>
                    <img src="http://openweathermap.org/img/wn/${data.icon}@2x.png" alt="Weather icon">
                    <p>Temperature: ${data.temperature} (${tempF}°F)</p>
                    <p>Feels Like: ${data.feels_like}</p>
                    <p>Condition: ${data.condition}</p>
                    <p>Wind Speed: ${data.wind_speed}</p>
                    <p>Humidity: ${data.humidity}</p>
                    <p>Sunrise: ${data.sunrise}</p>
                    <p>Sunset: ${data.sunset}</p>
                `;
                resultBox.classList.add('show');
                addToHistory(city);
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            resultBox.innerHTML = `
                <p style="color: red;">An error occurred: Could not fetch weather data. Please try again later.</p>
            `;
        });
});

function addToHistory(city) {
    if (!history.includes(city)) {
        history.push(city);

        // Limit history to the last 5 cities
        if (history.length > 5) {
            history.shift(); // Remove the oldest city
        }

        updateHistoryUI();
    }
}

function updateHistoryUI() {
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = ''; // Clear the current list

    // Add buttons for each city in history
    history.forEach((city) => {
        const button = document.createElement('button');
        button.textContent = city;
        button.addEventListener('click', () => {
            document.getElementById('city').value = city;
            document.getElementById('search').click();
        });
        historyDiv.appendChild(button);
    });
}

// Clear History Button
document.getElementById('clear-history').addEventListener('click', () => {
    history.length = 0; // Clear the history array
    updateHistoryUI(); // Update the UI
});
