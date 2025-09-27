function searchCity() {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    
    window.location.href = `dashboard.html?city=${encodeURIComponent(city)}`;
  } else {
    alert("Please enter a city name!");
  }
}

 function goAbout(){
  window.location.href = "About.html";
 }