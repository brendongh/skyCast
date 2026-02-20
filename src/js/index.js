const userLanguage = navigator.language
const hist = JSON.parse(localStorage.getItem('hist')) || []
const IMG_DIR = "" 
const html = {
    container:document.querySelectorAll(".weather-container"),
    weatherData:document.querySelector("#weather-data"),
    icon:document.querySelector("#weather-icon"),
    city:document.querySelector("#city"),
    date:document.querySelector("#date"),
    condition:document.querySelector("#condition"),
    location:document.querySelectorAll(".location")[0],
    temp:document.querySelector("#temp"),
    humidity:document.querySelector("#humidity"),
    windSpeed:document.querySelector("#wind-speed"),
    feelsLike:document.querySelector("#feels-like"),
    forecastContainer:document.querySelector("#forecast-container"),
    content:document.querySelector("#content"),
    chart:document.querySelector("#chart"),
    btnSearch:document.querySelector("#search-btn"),

    searchHistList:document.querySelector("#search-hist"),
    searchInput:document.querySelector("#search-input"),
    errorMessage:document.querySelector("#error-message")
}
function toggleLoading(isLoading) {
    // Seleciona todos os campos que recebem dados da API
    const fields = [
        html.temp, 
        html.humidity, 
        html.windSpeed, 
        html.feelsLike, 
        html.condition,
        html.chart,
        html.location,
        html.icon // Se quiser esconder o ícone também
    ];

       
    

    fields.forEach(field => {
        if (isLoading) {
            field.classList.add('skeleton');
        } else {
            field.classList.remove('skeleton');
        }
    });
}
function getDate(datetime){
    const formatedDate = datetime.replace("-", "/")
    const curDate = new Date(formatedDate)
    const date = curDate.getDate()
    const daysOfTheWeek = curDate.toLocaleDateString(userLanguage, { weekday: 'long' });
    const month = curDate.toLocaleDateString(userLanguage, { month: 'long' });
    return {date, daysOfTheWeek, month}
}
function forecastCard(index, params){
    const {datetime, temp, icon} = params

    const {daysOfTheWeek, date} = getDate(datetime)

    

    return `
        <div class="forecast-card ${index === 0 && "selected"}" data-index=${index}>
            <span class="day">${daysOfTheWeek.slice(0, 3)}, ${date}</span>
            <img src="${IMG_DIR}/${icon}.svg" alt="Chuva">
            <span class="temp">${temp.toFixed(0)}°C</span>
        </div>
        `
}
function setCurrent(params, isNewDay = true){
   if(isNewDay){

       const {daysOfTheWeek, date, month} = getDate(params.datetime)
     
       html.date.textContent = `${daysOfTheWeek}, ${date} de ${month}`
    }
    html.condition.textContent = params.conditions
    html.feelsLike.textContent = `${params.feelslike} °C`
    html.humidity.textContent = `${params.humidity} %`
    html.icon.src = `${IMG_DIR}/${params.icon}.svg`
    html.temp.textContent = params.temp.toFixed(0)
    html.windSpeed.textContent = `${params.windspeed} km/h`
}
function setForecast(days){
    const day = days.map((day, index)=>forecastCard(index, day))
    html.forecastContainer.innerHTML = day.join("")


}
import renderChart from "./chart.js"

const fetchWeatherData = async (city) => {
    const apiKey = 'Q2WT2SYZH9TQKWET8CT7MUNXL';
    const unitGroup = 'metric';
    const contentType = 'json';
    const lang = userLanguage.split("-")[0]
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(city)}?unitGroup=${unitGroup}&lang=${lang}&contentType=${contentType}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data
        // Further processing of data can be done here
    } catch (error) {
        console.error('Error fetching the weather data:', error);
    }
    
};
function addToLocalStorage(address){
    if(hist.includes(address))return 

    hist.unshift(address)
    localStorage.setItem('hist', JSON.stringify(hist.slice(0, 5)));
}
async function updateUI(json){
    
    
    content.style.display="block";

    const {description, resolvedAddress, address} = json
    addToLocalStorage(resolvedAddress)

    const today = new Date()
    const formatedDate = today.toLocaleDateString('en-CA').replace(/-/g, '/');
    html.city.textContent = resolvedAddress

    const curDay = json.days[0]

    setCurrent({...curDay, datetime:formatedDate})
    setForecast(json.days)
    getSearchHist()

    const temps = curDay.hours.filter((t, i)=> i % 2 == 0)

    renderChart(temps, setCurrent)

    html.forecastContainer.addEventListener("click", evt=>{
        document.querySelectorAll(".selected")[0]?.classList?.remove("selected")

        const card = evt.target.closest('.forecast-card');
        card.classList.add("selected")
        console.log(card.dataset.index)

        setCurrent(json.days[card.dataset.index])
        const temps = json.days[card.dataset.index].hours.filter((t, i)=> i % 2 == 0)
        renderChart(temps, setCurrent)


    })
    
}
function getSearchHist(){
    const histLi = hist.map(place=>`<li>${place}</li>`)
    html.searchHistList.innerHTML = histLi.join("")
}
getSearchHist()

html.searchHistList.addEventListener("mousedown", evt=>{
    
    html.searchInput.value = evt.target.textContent
})
function throwError(message){
    html.errorMessage.textContent = message || "Não foi possivel fazer a busca"
    html.errorMessage.classList.remove("hidden")

}
function trySearch(){
    const city = html.searchInput.value
        if (city.trim() === "") {
            throwError("Digite o nome de uma cidade!")
            return;
        }
        search(city)
}
html.searchInput.addEventListener("keydown", evt=>{
    if (evt.key === 'Enter') {
        trySearch()
        evt.target.blur()
    }
})
html.btnSearch.addEventListener("click", trySearch)
async function search(city){
    html.btnSearch.disabled = true
    html.btnSearch.style.opacity = 0.5
    html.btnSearch.innerText = "buscando..."

    const btnOriginalText = "Buscar"

    try{
        // html.errorMessage.classList.add("hidden")
        const data = await fetchWeatherData(city)
        // const data = json

        
        
        if(!data) throw new Error("error ao buscar nome")
                
            updateUI(data)
            
    }catch(err){
        throwError(err.message)

    }
    finally{
        html.btnSearch.disabled = false
        html.btnSearch.innerText = btnOriginalText
        html.btnSearch.style.opacity = 1
        toggleLoading(false)


    }
}
function init(){
    search("rio de janeiro")
    
}

toggleLoading(true)
init()





