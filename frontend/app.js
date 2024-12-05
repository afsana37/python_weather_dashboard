document.getElementById('search').addEventListener('click', function () {
    const city = document.getElementById('city').value;
    const resultBox = document.getElementById('result');

    if (!city) {
        // Hide the result box if no city is entered
        resultBox.style.display = 'none';
        alert('Please enter a city name.');
        return;
    }

    // Show a loading message while fetching data
    resultBox.style.display = 'block';
    resultBox.innerHTML = '<p>Loading...</p>';

    // Fetch weather data from the Flask backend
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
                const tempF = (tempC * 9/5 + 32).toFixed(2);

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
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            resultBox.innerHTML = `
                <p style="color: red;">An error occurred: Could not fetch weather data. Please try again later.</p>
            `;
        });
});
