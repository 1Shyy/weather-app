const getWeatherButton = document.getElementById("get-weather-btn");
const cityNameInput = document.getElementById("city-name-input");

const apiKey = "3a3465d6ea049149996bf1f708c344fb";
const checkTime = ['03', '06', '09', '12', '15', '18', '21', '00']


async function getCurrentWeather(city) {
    try {
        const url = `https://ru.api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    
        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        }
        throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
    } catch (error) {
        console.error(error);
    }
}

function extractWeatherData(response) {
    const temperature = [response.list[0].main.temp];
    const feelsLike = [response.list[0].main.feels_like];
    const humidity = [response.list[0].main.humidity];
    const windSpeed = [response.list[0].wind.speed];
    const date = [response.list[0].dt_txt]
    const temp = [];
    const weatherIconUrl = [];
    const days = [];
    const str = response.list[0].dt_txt.slice(11,13);
    for (let i = 0; i < 8 ;i++) {
        if (str === checkTime[i]) {
            var startIndex = i;
            break;
        }
    }
    for (let i = 0; i < 40; i++){
        if (i > 4 && response.list[i].dt_txt.slice(11,13) == '12') {
            temperature.push(response.list[i].main.temp);
            feelsLike.push(response.list[i].main.feels_like);
            humidity.push(response.list[i].main.humidity);
            windSpeed.push(response.list[i].wind.speed);
            date.push(response.list[i].dt_txt);
        }
        let temper = response.list[i].main.temp;
        let weatherIcon = response.list[i].weather[0].icon;
        weatherIconUrl.push(`http://openweathermap.org/img/wn/${weatherIcon}.png`);
        temp.push(temper);
    }
    console.log(date)
    for (let i = 0; i < 5; i++) {
        dateFull = Date.parse(date[i].replace(' ','T'))
        days.push(new Intl.DateTimeFormat('ru',options = {
            day: "numeric",
            month: "short",
        }).format(dateFull));

    }
        return {
        temperature,
        feelsLike,
        humidity,
        weatherIconUrl,
        windSpeed,
        startIndex,
        temp,
        days,
    };
}

function displayWeather(weatherData) {
    const { temperature, feelsLike, humidity, weatherIconUrl, windSpeed, startIndex, temp, days} = weatherData;
    for (let i = 0; i < 5; i++) {
        document.getElementById(`current-city${i}`).innerHTML = "Погода в городе <p>&nbsp;" + cityNameInput.value;
        document.getElementById(`current-temperature${i}`).textContent = Math.trunc(temperature[i]) + '°C';
        document.getElementById(`feels-like${i}`).textContent = "Ощущается как: " + Math.trunc(feelsLike[i]) + '°C';
        document.getElementById(`wind-speed${i}`).textContent = "Скорость ветра: " + windSpeed[i] + 'м/с';
        document.getElementById(`humidity${i}`).textContent = "Влажность: " + humidity[i] + '%';
        document.getElementById(`day${i}`).textContent = days[i];
    }
    for (let i = 0; i < startIndex; i++) {
        document.getElementById(`time${i}`).style.display = "none";
    }
    for (let i = 0; i < 40 - startIndex; i++) {
        
        document.getElementById(`temp${startIndex+i}`).textContent = Math.trunc(temp[i]) + '°C';
        document.getElementById(`img${startIndex+i}`).src = weatherIconUrl[i];
    }
}

getWeatherButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const city = cityNameInput.value;
    if (!city) return alert("Please enter a city name");
    const response = await getCurrentWeather(city);
    const weatherData = extractWeatherData(response);
    displayWeather(weatherData);
    document.getElementById('weather').style.display = 'block'
    cityNameInput.value = "";
});

function openDay(evt, dayName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(dayName).style.display = "block";
    evt.currentTarget.className += " active";
}
