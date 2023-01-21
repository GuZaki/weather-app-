'use strict';

import conditions from "./conditions.js";

const apiKey = 'b6c25a69e17644689f565652232101';
// //const apiKey = 'e9a5d3b74bf84418b11193028231901'
// //http://api.weatherapi.com/v1/current.json?key=e9a5d3b74bf84418b111930282319011&q=London
// //http://api.weatherapi.com/v1/current.json?key=<YOUR_API_KEY>&q=London


// Получаем элементы на странице

const form = document.querySelector('.form');
const input = document.querySelector('.input');
const header = document.querySelector('.header');


//удаляем предыдущую карточку
function removeCard(){
    const prevCard = document.querySelector('.card');
        if(prevCard) prevCard.remove();
}

//создаем карточку с сообщением об ошибке
function showError(errorMessage){
    //создаем разметку для карточки
    const html = `<div class="card">${errorMessage}</div>`
    // отображаем карточку на странице
    header.insertAdjacentHTML('afterend', html);
}

//Отображаем данные в карточке на странице
//function showCard(name, country, temp, text)

function showCard({ name, country, temp, text, img }){
    //создаем разметку для карточки
    const html = `<div class="card">
                    <h2 class="card-city">${name} <span>${country}</span></h2>
                    <div class="card-weather">
                        <div class="card-value">${temp}<sup>°c</sup></div>
                        <img class="card-img" src="${img}" alt="weather picture">
                    </div>
                    <div class="cadr-description">${text}</div>
                </div>`;
// отображаем карточку на странице
header.insertAdjacentHTML('afterend', html);
}

//Делаем запрос на сервер для получения данных
async function getWeather(city){
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`; //адрес запроса
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
}

//Слушаем отправку формы
form.addEventListener('submit', async (event)=> {
    event.preventDefault(); //отмена отправки формы /чтобы страница не обновлялась

    let city = input.value.trim();//Берем название нужного города из значения введеного в инпут, обрезаем пробелы

    const data = await getWeather(city);//получаем данные с сервера

    if(data.error){
            removeCard();
            showError(data.error.message);
        } else{ 
            removeCard();
        
            console.log(data.current.condition.code);

            // const info = conditions.find((obj) => {
            //     if(obj.code === data.current.condition.code) return true;  
            // })

            const info = conditions.find((obj) => obj.code === data.current.condition.code);
            console.log(info);
            console.log(info.languages[23]['day_text']);

            const filePath = `./img/${data.current.is_day ? 'day' : 'night'}/`;
            const fileName = (data.current.is_day ? info.day : info.night) + '.png';
            console.log('filePath', );
            const imgPath = filePath + fileName;
            

            const weatherData = {
                name: data.location.name, 
                country: data.location.country, 
                temp: data.current.temp_c, 
                text: data.current.is_day ? info.languages[23]['day_text'] : info.languages[23]['night_text'],
                img: imgPath,
            };

            showCard(weatherData);
            //showCard(data.location.name, data.location.country, data.current.temp_c, data.current.condition.text);
            }



    // //выполняем запрос 2 вариант
    // fetch(url).then((response) =>{
    //     return response.json();
    // }).then((data) => {
    //     console.log(data);

    //     if(data.error){//если ошибка есть - выводим ее
    //         removeCard();
    //         showError(data.error.message);
    //     } else{ //если ошибки нет
    //         removeCard();
    //         showCard(data.location.name, data.location.country, data.current.temp_c, data.current.condition.text);
    //         }
    // })
})