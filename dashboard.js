window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const city = params.get("city");

   if (!city) {
    window.location.replace("citynotfound.html");
    return;
  }

  fetchWeather(city);
};

function fetchWeather(city) {
  const apiKey = "31a1f4ecf683d5b86d692ec1990ed0a7";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.cod === "200") {

        document.getElementById("cityName").innerText = `${data.city.name}, ${data.city.country}`;
        document.getElementById("temperature").innerText = `${data.list[0].main.temp}°C`;
        document.getElementById("condition").innerText = data.list[0].weather[0].description;

        const lat = data.city.coord.lat;
        const lon = data.city.coord.lon;
        fetchLocalTime(lat, lon);



        const forecastDiv = document.getElementById("forecast");
        forecastDiv.innerHTML = "";
        for (let i = 1; i <= 2; i++) {
          const day = data.list[i * 8]; 
          forecastDiv.innerHTML += `
            <div class="forecast-card">
              <h4>${new Date(day.dt * 1000).toLocaleDateString()}</h4>
              <p>${day.main.temp}°C</p>
              <p>${day.weather[0].main}</p>
            </div>
          `;
        }

        const deg = data.list[0].wind.deg;
        document.getElementById("windDirection").innerText = `Wind Direction: ${deg}°`;
        document.getElementById("wind").innerText = `Wind Speed: ${data.list[0].wind.speed} m/s`;
        document.getElementById("sunrise").innerText = `Sunrise: ${new Date(data.city.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        document.getElementById("sunset").innerText = `Sunset: ${new Date(data.city.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

        document.getElementById("humidity").innerText = `Humidity: ${data.list[0].main.humidity}%`;
        document.getElementById("visibility").innerText = `Visibility: ${data.list[0].visibility / 1000} km`;

        fetchAirQuality(lat, lon);

      } else {
  
        window.location.replace("citynotfound.html");
      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
      window.location.replace("citynotfound.html");
    });

}

function fetchAirQuality(lat, lon) {
  const apiKey = "31a1f4ecf683d5b86d692ec1990ed0a7";
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const aqi = data.list[0].main.aqi;
      let quality = "";

      switch (aqi) {
        case 1: quality = "Good 😀"; break;
        case 2: quality = "Fair 🙂"; break;
        case 3: quality = "Moderate 😐"; break;
        case 4: quality = "Poor 😷"; break;
        case 5: quality = "Very Poor 🤢"; break;
        default: quality = "Unknown";
      }

      document.getElementById("airQuality").innerText = `Air Quality: ${quality}`;
    })
    .catch(err => {
      console.error("Error fetching AQI:", err);
      document.getElementById("airQuality").innerText = "Air Quality: Not available";
    });
}



function goBack() {
  window.location.href = "index.html";
}

async function fetchLocalTime(lat, lon) {
  const TIMEZONEDB_KEY = "GQWLIONB7SYK"; 
  try {
    const utcNow = Math.floor(Date.now() / 1000); 

    const res = await fetch(
      `https://api.timezonedb.com/v2.1/get-time-zone?key=${TIMEZONEDB_KEY}&format=json&by=position&lat=${lat}&lng=${lon}&time=${utcNow}`
    );
    const tzData = await res.json();
    const timeZoneId = tzData.zoneName;

    const date = new Date(); 
    const formatted = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: timeZoneId
    }).format(date);

    document.getElementById("dateTime").innerText = ` ${formatted}`;
  } catch (err) {
    console.error("Error fetching timezone:", err);
    document.getElementById("dateTime").innerText = "Local Time: Not available";
  }
}

