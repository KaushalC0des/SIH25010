document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("searchbtn");
    const cityInput = document.getElementById("City");
    const weatherContainer = document.getElementById("WeatherContainer");
    const temp = document.getElementById("temp");
    const cityHeader = document.getElementById("cityName");
    const condition = document.getElementById("Condition");
    const windSpeed = document.getElementById("windspeed");
    const errorPara = document.getElementById("Error");

    searchBtn.addEventListener("click", () => {
        const city = cityInput.value.trim();
        if (city) {
            getCoordinates(city);
        } else {
            showError("Please Enter Valid City");
        }
    });

    async function getCoordinates(city) {
        showError("");
        try {
            const response = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
            );
            if (!response.ok) {
                throw new Error("CITY NOT FOUND");
            }

            const data = await response.json();
            if (!data.results || data.results.length === 0) {
                throw new Error("CITY NOT FOUND");
            }
            const { latitude, longitude, name, country } = data.results[0];
            getWeather(latitude, longitude, name, country);
        } catch (error) {
            showError(error.message);
        }
    }

    async function getWeather(latitude, longitude, name, country) {
        try {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            );

            if (!response.ok) {
                throw new Error("Weather data not available");
            }

            const data = await response.json();
            displayWeather(data.current_weather, name, country);
        } catch (error) {
            showError(error.message);
        }
    }

    function displayWeather(weather, name, country) {
        const weatherCodeMap = {
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Depositing rime fog",
            51: "Light drizzle",
            61: "Slight rain",
            80: "Rain showers",
        };

        const weatherCondition = weatherCodeMap[weather.weathercode] || "Unknown Condition";

        weatherContainer.style.display = "block";
        cityHeader.textContent = `${name}, ${country}`;
        temp.textContent = `Temperature: ${weather.temperature}°C`;
        condition.textContent = `Condition: ${weatherCondition}`;
        windSpeed.textContent = `Wind Speed: ${weather.windspeed} km/h`;
    }

    function showError(message) {
        weatherContainer.style.display = "none";
        errorPara.textContent = message;
    }
});
