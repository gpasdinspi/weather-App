import './styles/reset.css';

async function getWeather(city) {
    let respons = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=EDNQHTB9LK9ZHRDANNKXY8EC9`)
    let data = respons.json();
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

(function main(){
    let btn = document.querySelector(".city-btn");
    btn.addEventListener("click", (e)=>{
        e.preventDefault();
        let city = document.getElementById("city").value || "london";
        getWeather(city).then(r => {
            console.log(filterJson(r))
        })
    })
    

})();