const loader = document.querySelector(".loader");

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(location => {
    const long = location.coords.longitude;
    const lat = location.coords.latitude;
    getWeatherData(long, lat);
  }, () => {
    loader.textContent = "Vous avez refusé la géolocalisation, l'application ne peut pas fonctionner"
  })
}

async function getWeatherData(long, lat) {
  try {
    const results = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=f4883c0a30d296fbd2204d774c22c9fc`)


    if (!results.ok) {
      throw new Error(`Erreur: ${results.status}`)
    }

    const data = await results.json();
    console.log(data);
    populateMainInfo(data);
    handleHours(data.hourly)
    handleDays(data.daily)

    loader.classList.add("fade-out")

  }
  catch(error){
    loader.textContent = error;
  }
}

const position = document.querySelector(".position");
const temperature = document.querySelector(".temperature");
const weatherImg = document.querySelector(".weather-image");

const currentHour = new Date().getHours()

function populateMainInfo(data) {
  //.trunc -> return a nombre entier
  temperature.textContent = `${Math.trunc(data.current.temp)}°`;
  position.textContent = data.timezone;

  if (currentHour >= 6 && currentHour < 21) {
    weatherImg.src = `./ressources/jour/${data.current.weather[0].icon}.svg`
  } else {
    weatherImg.src = `./ressources/night/${data.current.weather[0].icon}.svg`
  }
}

const hourNameBlocks = document.querySelectorAll(".hour-name");
const hourTemperature = document.querySelectorAll(".hour-temp");

function handleHours(data) {
  hourNameBlocks.forEach((__, index) => {
    const intervalHour = index * 3;
    const incrementedHour = currentHour + intervalHour;

    if (incrementedHour > 24) {
      const resetHour = incrementedHour - 24;
      hourNameBlocks[index].textContent = `${resetHour === 24 ? "00" : resetHour}h`;
    }
    else if (incrementedHour === 24){
      hourNameBlocks[index].textContent = "00h";
    }
    else {
      hourNameBlocks[index].textContent = `${incrementedHour}h`
    }

    // Temperature
    hourTemperature[index].textContent = `${Math.trunc(data[intervalHour].temp)}°`
  })
}

const weekDays = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche"
]

// undefined -> Langage par défaut du navigateur
const currentDay = new Date().toLocaleDateString(undefined, {weekday: "long"});

// les jours qui ont été slice
const restOfDays = weekDays.slice(0, weekDays.indexOf(currentDay) + 1);
const forecastDays = weekDays.slice(weekDays.indexOf(currentDay) + 1).concat(restOfDays);
console.log(forecastDays);

const daysName = document.querySelectorAll(".day-name");
const perDayTemperature = document.querySelectorAll(".day-temp");

function handleDays(data) {
  forecastDays.forEach((__, index) => {
    // mettre en majuscule la première lettre
    daysName[index].textContent = forecastDays[index].charAt(0).toUpperCase() + forecastDays[index].slice(1, 3);

    perDayTemperature[index].textContent = `${Math.trunc(data[index + 1].temp.day)}°`
  })
}

// TABS

const tabsBtns = [...document.querySelectorAll(".tabs button")]
const tabsContents = [...document.querySelectorAll(".forecast")]

tabsBtns.forEach(btn => btn.addEventListener("click", handleTabs));

function handleTabs(event) {
  // remove the active class

  // Trouver l'index du bouton ou est la classe Active
  const indexToRemove = tabsBtns.findIndex(tab => tab.classList.contains("active"));

  tabsBtns[indexToRemove].classList.remove("active");
  tabsContents[indexToRemove].classList.remove("active");

  // Ajout de la class Active

  //Index du click
  const indexToShow = tabsBtns.indexOf(event.target);

  tabsBtns[indexToShow].classList.add("active");
  tabsContents[indexToShow].classList.add("active");
}
