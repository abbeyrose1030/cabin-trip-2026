/* ═══════════════════════════════════════════════════════════
   CABIN TRIP 2026 — Fun Things
   ═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════
   COUNTDOWN TIMER
   ═══════════════════════════════════════════════════════════ */

function updateCountdown() {
    // Trip date: January 2, 2026 at 3:00 PM (adjust time as needed)
    const tripDate = new Date('2026-01-02T15:00:00').getTime();
    const now = new Date().getTime();
    const distance = tripDate - now;

    if (distance < 0) {
        document.getElementById('countdownDisplay').innerHTML = '<p class="countdown-finished">🎉 THE TRIP IS HERE! 🎉</p>';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

/* ═══════════════════════════════════════════════════════════
   WEATHER WIDGET
   ═══════════════════════════════════════════════════════════ */

async function fetchWeather() {
    const weatherWidget = document.getElementById('weatherWidget');
    
    try {
        // Using Open-Meteo API (free, no key required)
        // Gatlinburg, TN coordinates: 35.7143, -83.5102
        const response = await fetch(
            'https://api.open-meteo.com/v1/forecast?latitude=35.7143&longitude=-83.5102&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FNew_York&forecast_days=7'
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
        3: '☁️',  // Overcast
        45: '🌫️', // Fog
        48: '🌫️', // Depositing rime fog
        51: '🌦️', // Light drizzle
        53: '🌦️', // Moderate drizzle
        55: '🌧️', // Dense drizzle
        61: '🌧️', // Slight rain
        63: '🌧️', // Moderate rain
        65: '🌧️', // Heavy rain
        71: '🌨️', // Slight snow
        73: '🌨️', // Moderate snow
        75: '❄️',  // Heavy snow
        77: '🌨️', // Snow grains
        80: '🌦️', // Slight rain showers
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

function displayWeather(data) {
    const weatherWidget = document.getElementById('weatherWidget');
    const current = data.current;
    const daily = data.daily;
    
    let html = `
        <div class="weather-current">
            <div class="weather-temp-display">
                <span class="weather-icon-large">${getWeatherEmoji(current.weather_code)}</span>
                <span class="weather-temp-large">${Math.round(current.temperature_2m)}°F</span>
            </div>
            <p class="weather-location">Current in Gatlinburg, TN</p>
            <p class="weather-wind">Wind: ${Math.round(current.wind_speed_10m)} mph</p>
        </div>
        
        <div class="weather-forecast">
            <h3 class="weather-forecast-title">7-Day Forecast</h3>
            <div class="weather-forecast-grid">
    `;
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(daily.time[i]);
        const dayName = i === 0 ? 'Today' : days[date.getDay()];
        const emoji = getWeatherEmoji(daily.weather_code[i]);
        const high = Math.round(daily.temperature_2m_max[i]);
        const low = Math.round(daily.temperature_2m_min[i]);
        const precip = daily.precipitation_probability_max[i] || 0;
        
        html += `
            <div class="weather-day">
                <div class="weather-day-name">${dayName}</div>
                <div class="weather-day-icon">${emoji}</div>
                <div class="weather-day-temp">${high}° / ${low}°</div>
                <div class="weather-day-precip">${precip}% 💧</div>
            </div>
        `;
    }
    
    html += `
            </div>
        </div>
    `;
    
    weatherWidget.innerHTML = html;
}

// Fetch weather on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchWeather();
});

/* ═══════════════════════════════════════════════════════════
   CARPOOL COORDINATOR
   ═══════════════════════════════════════════════════════════ */

// Feature coming soon - placeholder for now

