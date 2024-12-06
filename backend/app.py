from flask import Flask, request, jsonify, session
import requests
from flask_cors import CORS
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)
CORS(app)
app.secret_key = "your_secret_key"  # Replace with a strong secret key

API_KEY = os.getenv("API_KEY")

users = {}  # In-memory user storage


# Get current weather
@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({"error": "City name is required"}), 400

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


# Get 5-day forecast
@app.route('/forecast', methods=['GET'])
def get_forecast():
    city = request.args.get('city')
    if not city:
        return jsonify({"error": "City name is required"}), 400

    url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"
    response = requests.get(url)

    if response.status_code != 200:
        return jsonify({"error": "City not found"}), 404

    forecast_data = response.json()
    daily_forecast = []

    for i in range(0, len(forecast_data['list']), 8):  # Extract one forecast per day
        item = forecast_data['list'][i]
        daily_forecast.append({
            "date": item['dt_txt'].split(' ')[0],
            "temperature": f"{item['main']['temp']}°C",
            "condition": item['weather'][0]['description'],
            "icon": item['weather'][0]['icon']
        })

    return jsonify({"city": forecast_data["city"]["name"], "forecast": daily_forecast})


# User registration
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if username in users:
        return jsonify({"error": "User already exists"}), 400
    users[username] = {"password": password, "favorites": []}
    return jsonify({"message": "Registration successful"}), 200


# User login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    user = users.get(username)
    if not user or user['password'] != password:
        return jsonify({"error": "Invalid credentials"}), 401
    session['username'] = username
    return jsonify({"message": "Login successful"}), 200


# Favorites management
@app.route('/favorites', methods=['POST', 'GET'])
def favorites():
    if 'username' not in session:
        return jsonify({"error": "Unauthorized"}), 401
    username = session['username']
    if request.method == 'POST':
        city = request.json.get('city')
        if city not in users[username]['favorites']:
            users[username]['favorites'].append(city)
        return jsonify({"favorites": users[username]['favorites']}), 200
    return jsonify({"favorites": users[username]['favorites']}), 200


if __name__ == '__main__':
    app.run(debug=True)