import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';

function Weather() {
    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState("");
    const [isNight, setIsNight] = useState(false);

    const allIcons = {
        "01d": clear_icon, 
        "02d": cloud_icon,
        "04d": drizzle_icon,
        "09d": rain_icon, 
        "13d": snow_icon, 
    };

    const search = async (city) => {
        if (!city) {
            setError("Enter a city name!");
            return;
        }

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.cod !== 200) {
                setWeatherData(null);
                setError(`Error: ${data.message}`);
                return;
            }

            const iconCode = data.weather[0].icon;
            setIsNight(iconCode.includes("n"));

            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: allIcons[iconCode] || clear_icon,
            });

            setError(""); 
        } catch (error) {
            setWeatherData(null);
            setError("Failed to fetch data. Check your internet connection.");
        }
    };

    useEffect(() => {
        search("Jalandhar");
    }, []);

    return (
        <div className={`weather ${isNight ? 'night-mode' : ''}`}>
            <div className='search-bar'>
                <input type='text' ref={inputRef} placeholder='Enter city name' />
                <img src={search_icon} alt="Search" onClick={() => search(inputRef.current.value)} />
            </div>

            {error && <p className="error-message">{error}</p>}

            {weatherData && (
                <>
                    <img src={weatherData.icon} alt='' className='weather-icon' />
                    <p className='temperature'>{weatherData.temperature}°C</p>
                    <p className='location'>{weatherData.location}</p>

                    <div className='weather-data'>
                        <div className='col'>
                            <img src={humidity_icon} alt='' />
                            <div>
                                <p>{weatherData.humidity} %</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className='col'>
                            <img src={wind_icon} alt='' />
                            <div>
                                <p>{weatherData.windSpeed} Km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Weather;
