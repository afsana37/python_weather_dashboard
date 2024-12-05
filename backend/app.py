from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

API_KEY = "your api key"  # Replace with your OpenWeatherMap API key

@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({"error": "City name is required"}), 400

    # Fetch weather data from OpenWeatherMap API
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    response = requests.get(url)

    if response.status_code != 200:
        return jsonify({"error": "City not found"}), 404

    weather_data = response.json()
    return jsonify({
        "city": weather_data["name"],
        "temperature": f"{weather_data['main']['temp']}°C",
        "feels_like": f"{weather_data['main']['feels_like']}°C",
        "condition": weather_data["weather"][0]["description"],
        "icon": weather_data["weather"][0]["icon"],
        "wind_speed": f"{weather_data['wind']['speed']} m/s",
        "humidity": f"{weather_data['main']['humidity']}%",
        "sunrise": datetime.fromtimestamp(weather_data["sys"]["sunrise"]).strftime("%I:%M %p"),
        "sunset": datetime.fromtimestamp(weather_data["sys"]["sunset"]).strftime("%I:%M %p")
    })

if __name__ == '__main__':
    app.run(debug=True)
