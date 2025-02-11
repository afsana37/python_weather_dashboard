FROM python:3.9
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
ARG WEATHER_API_KEY
ENV API_KEY=${WEATHER_API_KEY}
EXPOSE 5000
CMD ["python", "app.py"]
