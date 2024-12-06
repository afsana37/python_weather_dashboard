from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

API_KEY = os.getenv("API_KEY")  # Load the API key from .env


@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    units = request.args.get('units', 'metric')  # Default to metric

    if not (city or (lat and lon)):
        return jsonify({"error": "City name or coordinates are required"}), 400

    if city:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units={units}"
    else:
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units={units}"

    response = requests.get(url)
    if response.status_code != 200:
        return jsonify({"error": "City not found"}), 404

    weather_data = response.json()
    return jsonify({
        "city": weather_data["name"],
        "temperature": f"{weather_data['main']['temp']}°C" if units == 'metric' else f"{weather_data['main']['temp']}°F",
        "feels_like": f"{weather_data['main']['feels_like']}°C" if units == 'metric' else f"{weather_data['main']['feels_like']}°F",
        "condition": weather_data["weather"][0]["description"],
        "icon": weather_data["weather"][0]["icon"],
        "wind_speed": f"{weather_data['wind']['speed']} m/s",
        "humidity": f"{weather_data['main']['humidity']}%",
        "sunrise": datetime.fromtimestamp(weather_data["sys"]["sunrise"]).strftime("%I:%M %p"),
        "sunset": datetime.fromtimestamp(weather_data["sys"]["sunset"]).strftime("%I:%M %p")
    })


if __name__ == '__main__':
    app.run(debug=True)