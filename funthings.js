/* ═══════════════════════════════════════════════════════════
   CABIN TRIP 2026 — Fun Things
   ═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════
   WEATHER WIDGET
   ═══════════════════════════════════════════════════════════ */

async function fetchWeather() {
    const weatherWidget = document.getElementById('weatherWidget');
    
    if (!weatherWidget) {
        return; // Element not found, skip weather fetch
    }
    
    try {
        // Using Open-Meteo API (free, no key required)
        // Gatlinburg, TN coordinates: 35.7143, -83.5102
        const response = await fetch(
            'https://api.open-meteo.com/v1/forecast?latitude=35.7143&longitude=-83.5102&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York&forecast_days=7'
        );
        
        const data = await response.json();
        
        if (data && data.current && data.daily) {
            displayWeather(data);
        } else {
            throw new Error('Invalid weather data');
        }
    } catch (error) {
        console.error('Weather fetch error:', error);
        weatherWidget.innerHTML = `
            <p class="weather-error">Unable to load weather data. Check back later!</p>
        `;
    }
}

function getWeatherEmoji(code) {
    // Weather code mapping for Open-Meteo
    const weatherMap = {
        0: '☀️',  // Clear
        1: '🌤️',  // Mainly clear
        2: '⛅',  // Partly cloudy
        3: '⛅',  // Overcast
        45: '🌫️', // Fog
        48: '🌫️', // Depositing rime fog
        51: '🌧️', // Light drizzle
        53: '🌧️', // Moderate drizzle
        55: '🌧️', // Dense drizzle
        61: '🌧️', // Slight rain
        63: '🌧️', // Moderate rain
        65: '🌧️', // Heavy rain
        71: '🌨️', // Slight snow
        73: '🌨️', // Moderate snow
        75: '❄️',  // Heavy snow
        77: '🌨️', // Snow grains
        80: '🌧️', // Slight rain showers
        81: '🌧️', // Moderate rain showers
        82: '⛈️',  // Violent rain showers
        85: '🌨️', // Slight snow showers
        86: '❄️',  // Heavy snow showers
        95: '⛈️',  // Thunderstorm
        96: '⛈️',  // Thunderstorm with slight hail
        99: '⛈️'   // Thunderstorm with heavy hail
    };
    
    return weatherMap[code] || '🌤️';
}

function getWeatherDescription(code) {
    const weatherDesc = {
        0: 'Clear Sky',
        1: 'Mainly Clear',
        2: 'Partly Cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Foggy',
        51: 'Light Drizzle',
        53: 'Drizzle',
        55: 'Heavy Drizzle',
        61: 'Light Rain',
        63: 'Rain',
        65: 'Heavy Rain',
        71: 'Light Snow',
        73: 'Snow',
        75: 'Heavy Snow',
        77: 'Snow',
        80: 'Rain Showers',
        81: 'Rain Showers',
        82: 'Heavy Showers',
        85: 'Snow Showers',
        86: 'Heavy Snow',
        95: 'Thunderstorm',
        96: 'Thunderstorm',
        99: 'Thunderstorm'
    };
    return weatherDesc[code] || 'Clear';
}

function displayWeather(data) {
    const weatherWidget = document.getElementById('weatherWidget');
    if (!weatherWidget) {
        return; // Element not found
    }
    
    const current = data.current;
    const daily = data.daily;
    
    // Calculate wind direction
    const windDir = getWindDirection(current.wind_direction_10m);
    
    // Get UV index level
    const uvIndex = daily.uv_index_max[0];
    const uvLevel = uvIndex < 3 ? 'Low' : uvIndex < 6 ? 'Moderate' : uvIndex < 8 ? 'High' : 'Very High';
    
    let html = `
        <div class="weather-header">
            <div class="weather-location-info">
                <h2 class="weather-city">Gatlinburg, TN</h2>
                <p class="weather-condition">${getWeatherDescription(current.weather_code)}</p>
            </div>
            <div class="weather-icon-main">${getWeatherEmoji(current.weather_code)}</div>
        </div>
        
        <div class="weather-main">
            <div class="weather-temp-main">${Math.round(current.temperature_2m)}°</div>
            <div class="weather-temp-range">H: ${Math.round(daily.temperature_2m_max[0])}° L: ${Math.round(daily.temperature_2m_min[0])}°</div>
        </div>
        
        <div class="weather-details-grid">
            <div class="weather-detail">
                <div class="weather-detail-label">FEELS LIKE</div>
                <div class="weather-detail-value">${Math.round(current.apparent_temperature)}°</div>
            </div>
            <div class="weather-detail">
                <div class="weather-detail-label">HUMIDITY</div>
                <div class="weather-detail-value">${current.relative_humidity_2m}%</div>
            </div>
            <div class="weather-detail">
                <div class="weather-detail-label">WIND</div>
                <div class="weather-detail-value">${Math.round(current.wind_speed_10m)} mph ${windDir}</div>
            </div>
            <div class="weather-detail">
                <div class="weather-detail-label">UV INDEX</div>
                <div class="weather-detail-value">${uvLevel}</div>
            </div>
        </div>
        
        <div class="weather-forecast">
            <h3 class="weather-forecast-title">7-Day Forecast</h3>
            <div class="weather-forecast-grid">
    `;
    
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(daily.time[i]);
        const dayName = i === 0 ? 'TODAY' : days[date.getDay()];
        const emoji = getWeatherEmoji(daily.weather_code[i]);
        const high = Math.round(daily.temperature_2m_max[i]);
        const low = Math.round(daily.temperature_2m_min[i]);
        
        html += `
            <div class="weather-day">
                <div class="weather-day-name">${dayName}</div>
                <div class="weather-day-icon">${emoji}</div>
                <div class="weather-day-temp">${high}° | ${low}°</div>
            </div>
        `;
    }
    
    html += `
            </div>
        </div>
    `;
    
    weatherWidget.innerHTML = html;
}

function getWindDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

// Fetch weather on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchWeather();
});

/* ═══════════════════════════════════════════════════════════
   CARPOOL COORDINATOR
   ═══════════════════════════════════════════════════════════ */

// Feature coming soon - placeholder for now

