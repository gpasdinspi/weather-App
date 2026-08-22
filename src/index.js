import './styles/reset.css';
import sun from "./img/sun.png";
import snow from "./img/snow.png";
import rain from "./img/rainy-day.png";
import clouds from "./img/clouds.png";
import weather from "./img/weather.png";
let symbol = "°F";

async function getWeather(city) {
    let respons = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=EDNQHTB9LK9ZHRDANNKXY8EC9`)
    let data = await respons.json();
    console.log(data);
    return data;
}

function filterJson(data){
    return {
        "adress" : data.address,
        "currentCondition" : data.currentConditions, // Json avec d'autre variables
        "days" : data.days,
        "description" : data.description,
    }
}

function getGif(temp) {
    temp = temp.toLowerCase();
    if (temp.includes("snow")){
        return snow;
    }
    if (temp.includes("rain")){
        return rain;
    }
    if (temp.includes("clear")){
        return sun;
    }
    if (temp.includes("partly-cloudy-day")){
        return weather;
        }
    return clouds;
}

function displayWeather(data){
    let container = document.querySelector(".display");
    let html = `
     <div class="today">
            <div class="L1">
                <H4>
                    ${data.adress}
                </H4>
                <div>
                    <p>°C</p> | <p>°F</p>
                </div>
            </div>
            <div class="info">
                <div class="temp">
                    <img id="big-logo" src=${getGif(data.currentCondition.icon)}>
                    ${data.currentCondition.temp } ${symbol}
                </div>
                <div class="details">
                <p>condition : ${data.currentCondition.conditions} </p>
                <p>humidity : ${data.currentCondition.humidity} </p>
                <p>sunrise : ${data.currentCondition.sunrise} </p>
                <p>sunset : ${data.currentCondition.sunset} </p>

                </div>
            </div>
        <hr>
        </div>
        <div class="nextDays">
        `
        for (const element of data.days.slice(1)) {
            html += `
             <div class="day">
                <h5>${element.datetime}</h5>
                <img id="logo" src=${getGif(element.icon)}>
                <p>${element.tempmax} ${symbol} ${element.tempmin} ${symbol}</p>
            </div>
            `
        }
        html += `
        </div>
        <hr>
        <div class="description">
        
            ${data.description}
        
        </div>
        <hr>
    `
    container.innerHTML = html;
}

(function main(){
    let btn = document.querySelector(".city-btn");
    btn.addEventListener("click", (e)=>{
        e.preventDefault();
        let city = document.getElementById("city").value || "london";
        getWeather(city).then(r => {
            console.log(filterJson(r));
            displayWeather(filterJson(r));
        })
    })
    

})();