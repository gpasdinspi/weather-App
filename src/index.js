import './styles/reset.css';
import sun from "./img/sun.png";
import snow from "./img/snow.png";
import rain from "./img/rainy-day.png";
import clouds from "./img/clouds.png";
import weather from "./img/weather.png";
import humidity from "./img/humidity.png";
import sunrise from "./img/sunrise.png";
import sunset from "./img/sunset.png";

let degree = "F°"

async function getWeather(city, symbol) {
    let unit;
    if (symbol == "fahrenheit"){
        unit = "us"
    }else{
        unit="metric"
    }
    let respons = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unit}&key=EDNQHTB9LK9ZHRDANNKXY8EC9`)
    let data = await respons.json();
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
    let i = 0;
    let html = `
     <div class="today">
            <div class="L1">
                <h3>
                    ${data.adress}
                </h3>
            </div>
            <div class="info">
                <div class="temp">
                    <img id="big-logo" src=${getGif(data.currentCondition.icon)}>
                    <h3>${data.currentCondition.temp } ${degree}</h3>
                </div>
                <div class="details">
                <p>${data.currentCondition.conditions} </p>
                <p><img id="little-logo" src=${humidity}> ${data.currentCondition.humidity} </p>
                <p><img id="little-logo" src=${sunrise}> ${data.currentCondition.sunrise} </p>
                <p><img id="little-logo" src=${sunset}> ${data.currentCondition.sunset} </p>

                </div>
            </div>
        </div>
        <div class="nextDays">
        `
        for (const element of data.days.slice(0, 7)) {
            html += `
             <div class="day" id="day${i}">
                <p>${getDate(element.datetime)}</p>
                <img id="logo" src=${getGif(element.icon)}>
                <p><h4>${element.tempmax} ${degree}</h4> ${element.tempmin} ${degree}</p>
            </div>
            `
            i++;
        }
        html += `
        </div>
        <div class="description">
        
            ${data.description}
        
        </div>
    `
    container.innerHTML = html;

    for ( let j = 0; j <7; j++){
        let e = document.querySelector(`#day${j}`);
        e.addEventListener("click", ()=>{
            displayNextWeather(data.days[j], data.adress);
        })
    }
}

function getDate(dateInput){
    const date = (dateInput instanceof Date) ? dateInput : new Date(dateInput);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
}

function displayNextWeather(data, adress){
    let today = document.querySelector(".today")
    console.log("data : " + data)
    today.innerHTML = `
     <div class="L1">
                <h3>
                    ${adress}
                </h3>
    </div>
    <div class="info">
        <div class="temp">
            <img id="big-logo" src=${getGif(data.icon)}>
            <h3>${data.temp } ${degree}</h3>
        </div>
        <div class="details">
        <p>${data.conditions} </p>
        <p><img id="little-logo" src=${humidity}> ${data.humidity} </p>
        <p><img id="little-logo" src=${sunrise}> ${data.sunrise} </p>
        <p><img id="little-logo" src=${sunset}> ${data.sunset} </p>

        </div>
    </div>
    `
}

function hideLoadingScreen(){
    let loading = document.querySelector(".loading-screen");
    if (loading) loading.classList.add("hidden");
}

(function main(){
    let symbol = "fahrenheit";

    let btn = document.querySelector(".city-btn");
    let c = document.querySelector(".celcius");
    let f = document.querySelector(".fahrenheit");
    c.addEventListener("click", ()=>{
        symbol = "celcius";
        degree="C°"
        c.className ="celcius selected"
        f.className = "fahrenheit"
    })

    f.addEventListener("click", ()=>{
        symbol = "fahrenheit";
        degree="F°"
        c.className ="celcius";
        f.className = "selected fahrenheit"
    })

    btn.addEventListener("click", (e)=>{
        e.preventDefault();
        let loading = document.querySelector(".loading-screen");
        if (loading) loading.className = "loading-screen";
        let city = document.getElementById("city").value || "london";        
        getWeather(city, symbol).then(r => {
            console.log(filterJson(r));
            displayWeather(filterJson(r));
            hideLoadingScreen();
        })
    })
    

})();