"use client"

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { BsFillSunriseFill, BsFillSunsetFill, BsCloudRainHeavyFill } from 'react-icons/bs'
import {
  WiMoonAltWaningGibbous3,
  WiMoonAltThirdQuarter,
  WiMoonAltWaningCrescent3,
  WiMoonAltNew,
  WiMoonAltWaxingCrescent3,
  WiMoonAltFirstQuarter,
  WiMoonAltWaxingGibbous3,
  WiMoonAltFull
} from 'react-icons/wi'
import Image from 'next/image'
import Link from 'next/link'
import { Card, Row, Col, Input, Button, Spin, Typography, Divider, Tag, Space, Alert } from 'antd'
import { EnvironmentOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import CustomTooltip from './CustomTooltip'
import RainJauge from './RainJauge'

const { Title, Text } = Typography;

interface WeatherData {
  minutely: MinutelyData[]
  hourly: WeatherItem[]
  daily: WeatherForecast[]
  timezone: string
  timezone_offset: number
  lat: string
  lon: string
  current: {
    weather: Array<{ description: string, id: number }>
    wind_deg: number
    sunrise: number
    sunset: number
    temp: number
    feels_like: number
    humidity: number
    pressure: number
    wind_speed: number
    uvi: number
  }
  alerts: WeatherAlert[]
}

interface MinutelyData {
  dt: number
  precipitation: number
}

interface WeatherData2 {
  list: Array<{
    main: {
      aqi: number
    }
  }>
}

interface WeatherItem {
  dt: number
  weather: Array<{ description: string, id: number }>
  temp: number
  humidity: number
  pressure: number
  wind_speed: number
  wind_deg: number
  rain?: { '1h': number }
  pop?: number
  uvi: number
}

interface WeatherForecast {
  temp: {
    min: number
    max: number
  }
  weather: Array<{ description: string, id: number }>
  pop: number
  dt: number
  moon_phase: number
}

interface WeatherAlert {
  event: string
}

const API_KEY = process.env.API_KEY || "afe405b6f47fc44f4d31905e75906f89"; 

export default function WeatherComponent (): JSX.Element {
  let timeoutError: number | NodeJS.Timeout | null = null
  const [showComponents, setShowComponents] = useState(false)
  const [metaTheme, setMetaTheme] = useState('#1c95ec')
  const [mainImg, setMainImg] = useState(null as unknown as JSX.Element)
  const [city, setCity] = useState('' as unknown as string)
  // Use hardcoded coordinates for Tehran as default
  const [latitude] = useState('38.3257')
  const [longitude] = useState('48.4244')
  const [temperature, setTemperature] = useState('')
  const [description, setDescription] = useState('')
  const [feelsLike, setFeelsLike] = useState('')
  const [humidity, setHumidity] = useState('')
  const [wind, setWind] = useState('')
  const [windDirection, setWindDirection] = useState(0)
  const [pressure, setPressure] = useState('')
  const [sunrise, setSunrise] = useState('')
  const [sunset, setSunset] = useState('')
  const [airPollution, setAirPollution] = useState('')
  const [minutelyData, setMinutelyData] = useState<MinutelyData[]>([])
  const [uv, setUv] = useState(0)
  const [cityLatitude, setCityLatitude] = useState('')
  const [cityLongitude, setCityLongitude] = useState('')
  const [moonPhase, setMoonPhase] = useState(null as unknown as JSX.Element)
  const [dataChart1, setDataChart1] = useState(Array(24).fill(null))
  const [dataChart2, setDataChart2] = useState(Array(24).fill(null))
  const [time, setTime] = useState('')
  const [days, setDays] = useState(Array(7).fill(null))
  const [tempMinDays, setTempMinDays] = useState(Array(7).fill(null))
  const [tempMaxDays, setTempMaxDays] = useState(Array(7).fill(null))
  const [precipitationDays, setPrecipitationDays] = useState(Array(7).fill(null))
  const [imgDays, setImgDays] = useState(Array(7).fill(null))
  const [thunderMessage, setThunderMessage] = useState('')
  const [heatMessage, setHeatMessage] = useState('')
  const [floodMessage, setFloodMessage] = useState('')
  const [iceMessage, setIceMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)

  useEffect(() => {
    const metaThemeColor = document.querySelectorAll('.themecolor')
    if (metaThemeColor !== null) metaThemeColor.forEach((meta) => { meta.setAttribute('content', metaTheme) })
    
    if (typeof window !== 'undefined') {
      const savedCity = localStorage.getItem('city')
      setCity(savedCity || 'Tehran')
      
      // Auto-load weather data on component mount
      if (!showComponents) {
        loadDefaultWeatherData()
      }
    }
    
    if ('serviceWorker' in navigator) {
      void (async () => {
        try {
          await navigator.serviceWorker.register('/sw.js')
        } catch (error) {
          throw new Error(`Service worker registration failed, error: ${error}`)
        }
      })()
    }
  }, [metaTheme])

  // Add function to load default Tehran data
  const loadDefaultWeatherData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/weather/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          city: 'Tehran'
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        await fetchDataCurrent(data.city, data.oneCallData, data.airPollutionData)
        setShowComponents(true)
      } else {
        console.log('Failed to load default weather data:', data.error)
        // Don't show error for auto-load, just keep form visible
      }
    } catch (err) {
      console.log('Failed to auto-load weather data:', err)
      // Don't show error for auto-load, just keep form visible
    } finally {
      setLoading(false)
    }
  }

  // Add function to load weather data automatically
  const loadWeatherData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const lat = parseFloat(latitude)
      const lon = parseFloat(longitude)
      
      const response = await fetch('/api/weather/geolocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: lon
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to get weather data')
      }
      
      const data = await response.json()
      const { city, oneCallData, airPollutionData } = data
      await fetchDataCurrent(city, oneCallData, airPollutionData)
      setShowComponents(true)
      
    } catch (err) {
      console.error('Error loading weather data:', err)
      setError('Failed to load weather data')
    } finally {
      setLoading(false)
    }
  }

  const getImage = (id: number, sunDown: string, sunUp: string, time: string, main: boolean) => {
    let imgSrc = ''
    let backgroundColor = ''

    if ((id >= 200 && id <= 202) || (id >= 230 && id <= 232)) {
      imgSrc = '/assets/icons/storm.png'
      if (main) {
        if (time >= sunUp && time < sunDown) {
          backgroundColor = '#1e3a8a'
          setMetaTheme('#1e3a8a')
        } else {
          backgroundColor = '#1e40af'
          setMetaTheme('#1e40af')
        }
      }
    } else if (id >= 210 && id <= 221) {
      imgSrc = '/assets/icons/thunder.png'
      if (main) {
        if (time >= sunUp && time < sunDown) {
          backgroundColor = '#1d4ed8'
          setMetaTheme('#1d4ed8')
        } else {
          backgroundColor = '#2563eb'
          setMetaTheme('#2563eb')
        }
      }
    } else if (id >= 300 && id <= 321) {
      if (time >= sunUp && time < sunDown) {
        imgSrc = '/assets/icons/drizzle.png'
        if (main) {
          backgroundColor = '#3b82f6'
          setMetaTheme('#3b82f6')
        }
      } else {
        imgSrc = '/assets/icons/drizzleNight.png'
        if (main) {
          backgroundColor = '#2563eb'
          setMetaTheme('#2563eb')
        }
      }
    } else if (id === 500) {
      imgSrc = '/assets/icons/rain.png'
      if (main) {
        if (time >= sunUp && time < sunDown) {
          backgroundColor = '#60a5fa'
          setMetaTheme('#60a5fa')
        } else {
          backgroundColor = '#3b82f6'
          setMetaTheme('#3b82f6')
        }
      }
    } else if ((id >= 501 && id <= 504) || (id >= 520 && id <= 531)) {
      imgSrc = '/assets/icons/shower.png'
      if (main) {
        if (time >= sunUp && time < sunDown) {
          backgroundColor = '#1e40af'
          setMetaTheme('#1e40af')
        } else {
          backgroundColor = '#1d4ed8'
          setMetaTheme('#1d4ed8')
        }
      }
    } else if (id === 511) {
      imgSrc = '/assets/icons/hail.png'
      if (main) {
        if (time >= sunUp && time < sunDown) {
          backgroundColor = '#93c5fd'
          setMetaTheme('#93c5fd')
        } else {
          backgroundColor = '#60a5fa'
          setMetaTheme('#60a5fa')
        }
      }
    } else if (id === 600) {
      imgSrc = '/assets/icons/snow.png'
      if (main) {
        if (time >= sunUp && time < sunDown) {
          backgroundColor = '#dbeafe'
          setMetaTheme('#dbeafe')
        } else {
          backgroundColor = '#bfdbfe'
          setMetaTheme('#bfdbfe')
        }
      }
    } else if ((id === 601 || id === 602) || (id >= 620 && id <= 622)) {
      imgSrc = '/assets/icons/blizzard.png'
      if (main) {
        if (time >= sunUp && time < sunDown) {
          backgroundColor = '#bfdbfe'
          setMetaTheme('#bfdbfe')
        } else {
          backgroundColor = '#93c5fd'
          setMetaTheme('#93c5fd')
        }
      }
    } else if (id >= 611 && id <= 616) {
      if (main) {
        if (time >= sunUp && time < sunDown) {
          imgSrc = '/assets/icons/sleet.png'
          backgroundColor = '#1e40af'
          setMetaTheme('#1e40af')
        } else {
          imgSrc = '/assets/icons/sleetNight.png'
          backgroundColor = '#1d4ed8'
          setMetaTheme('#1d4ed8')
        }
      }
    } else if (id >= 701 && id <= 721) {
      if (time >= sunUp && time < sunDown) {
        imgSrc = '/assets/icons/haze.png'
        if (main) {
          backgroundColor = '#38aafc'
          setMetaTheme('#38aafc')
        }
      } else {
        imgSrc = '/assets/icons/hazeNight.png'
        if (main) {
          backgroundColor = '#1e40af'
          setMetaTheme('#1e40af')
        }
      }
    } else if (id === 731 || (id >= 751 && id <= 771)) {
      imgSrc = '/assets/icons/dust.png'
      if (main) {
        if (time >= sunUp && time < sunDown) {
          backgroundColor = '#38aafc'
          setMetaTheme('#38aafc')
        } else {
          backgroundColor = '#1e40af'
          setMetaTheme('#1e40af')
        }
      }
    } else if (id === 741) {
      imgSrc = '/assets/icons/fog.png'
      if (main) {
        if (time >= sunUp && time < sunDown) {
          backgroundColor = '#38aafc'
          setMetaTheme('#38aafc')
        } else {
          backgroundColor = '#1e40af'
          setMetaTheme('#1e40af')
        }
      }
    } else if (id === 781) {
      imgSrc = '/assets/icons/tornado.png'
      if (main) {
        if (time >= sunUp && time < sunDown) {
          backgroundColor = '#1e40af'
          setMetaTheme('#1e40af')
        } else {
          backgroundColor = '#1d4ed8'
          setMetaTheme('#1d4ed8')
        }
      }
    } else if (id === 800) {
      if (time >= sunUp && time < sunDown) {
        imgSrc = '/assets/icons/sun.png'
        if (main) {
          backgroundColor = '#1c95ec'
          setMetaTheme('#1c95ec')
        }
      } else {
        imgSrc = '/assets/icons/moon.png'
        if (main) {
          backgroundColor = '#1e40af'
          setMetaTheme('#1e40af')
        }
      }
    } else if (id === 801 || id === 802) {
      if (time >= sunUp && time < sunDown) {
        imgSrc = '/assets/icons/fewclouds.png'
        if (main) {
          backgroundColor = '#3b82f6'
          setMetaTheme('#3b82f6')
        }
      } else {
        imgSrc = '/assets/icons/fewcloudsNight.png'
        if (main) {
          backgroundColor = '#2563eb'
          setMetaTheme('#2563eb')
        }
      }
    } else {
      imgSrc = '/assets/icons/clouds.png'
      if (main) {
        if (time >= sunUp && time < sunDown) {
          backgroundColor = '#60a5fa'
          setMetaTheme('#60a5fa')
        } else {
          backgroundColor = '#3b82f6'
          setMetaTheme('#3b82f6')
        }
      }
    }
    return { imgSrc, backgroundColor }
  }

  const fetchDataAirPollution = async (data: number) => {
    const aqi = data
    let aqitxt = ''
    if (aqi === 1) aqitxt = `${aqi} (Excellent)`
    else if (aqi === 2) aqitxt = `${aqi} (Good)`
    else if (aqi === 3) aqitxt = `${aqi} (Moderate)`
    else if (aqi === 4) aqitxt = `${aqi} (Poor)`
    else aqitxt = `${aqi} (Very Poor)`
    setAirPollution(aqitxt)
  }

  const fetchDataMoon = async (data: number) => {
    const phase = data
    let phasehtml = null as unknown as JSX.Element
    if (phase > 0 && phase < 0.25) phasehtml = <WiMoonAltWaningGibbous3 />
    else if (phase === 0.25) phasehtml = <WiMoonAltThirdQuarter />
    else if (phase > 0.25 && phase < 0.5) phasehtml = <WiMoonAltWaningCrescent3 />
    else if (phase === 0.5) phasehtml = <WiMoonAltNew />
    else if (phase > 0.5 && phase < 0.75) phasehtml = <WiMoonAltWaxingCrescent3 />
    else if (phase === 0.75) phasehtml = <WiMoonAltFirstQuarter />
    else if (phase > 0.75 && phase < 1) phasehtml = <WiMoonAltWaxingGibbous3 />
    else phasehtml = <WiMoonAltFull />
    setMoonPhase(phasehtml)
  }

  const fetchDataForecasts = async (data: WeatherData, sunDown: string, sunUp: string) => {
    const { minutely, hourly, daily } = data
    const currentDateTime = new Date()
    const currentDay = currentDateTime.toLocaleDateString('en-US', { timeZone: data.timezone })
    const nextDay = new Date(currentDateTime.getTime() + 24 * 60 * 60 * 1000)
    const nextDayFormatted = nextDay.toLocaleDateString('en-US', { timeZone: data.timezone })
    const createChartData = (
      items: WeatherItem[],
      filterFn: (item: WeatherItem, index: number) => boolean
    ) => {
      return items
        .filter(filterFn)
        .map((item) => {
          const forecastDateTime = new Date(item.dt * 1000)
          const forecastTime = forecastDateTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: data.timezone
          })
          return {
            name: forecastTime,
            description: item.weather[0].description,
            temp: +item.temp.toFixed(1),
            humidity: item.humidity,
            pressure: item.pressure,
            wind: +(item.wind_speed * 3.6).toFixed(0),
            windDeg: item.wind_deg,
            weather: item.weather[0].id,
            precipitation: item.rain ? +item.rain['1h'].toFixed(2) : 0,
            rain: item.pop ? +(item.pop * 100).toFixed(0) : 0,
            uv: +item.uvi.toFixed(0),
            sunDownH: sunDown,
            sunUpH: sunUp
          }
        })
    }

    let chartData1 = createChartData(hourly, (item) => {
      const forecastDateTime = new Date(item.dt * 1000)
      const forecastDay = forecastDateTime.toLocaleDateString('en-US', { timeZone: data.timezone })
      return forecastDay === currentDay
    }).slice(1)

    if (window.innerWidth < 900 && chartData1.length > 12) {
      chartData1 = chartData1.filter((item, index) => index % 2 === 0)
    }

    const chartData2 = createChartData(hourly, (item, index) => {
      const forecastDateTime = new Date(item.dt * 1000)
      const forecastDay = forecastDateTime.toLocaleDateString('en-US', { timeZone: data.timezone })
      if (window.innerWidth < 900) {
        return forecastDay === nextDayFormatted && index % 2 === 0
      }
      return forecastDay === nextDayFormatted
    })

    const forecastsDaily = daily.slice(2)
    const temperaturesDailyMax = forecastsDaily.map((forecast: WeatherForecast) => Math.floor(forecast.temp.max))
    const temperaturesDailyMin = forecastsDaily.map((forecast: WeatherForecast) => Math.floor(forecast.temp.min))
    const precipitationDaily = forecastsDaily.map((forecast: WeatherForecast) => +(forecast.pop * 100).toFixed(0))
    const weatherIdsDaily = forecastsDaily.map((forecast: WeatherForecast) => forecast.weather[0].id)
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const dates = forecastsDaily.map((forecast: WeatherForecast) => new Date(forecast.dt * 1000))
    const daysOfWeek = dates.map((date: Date) => days[date.getDay()])

    for (let i = 0; i < 7; i += 1) {
      setDays((prevDay) => [
        ...prevDay.slice(0, i),
        daysOfWeek[i],
        ...prevDay.slice(i + 1)
      ])

      setPrecipitationDays((prevPrecipitation) => [
        ...prevPrecipitation.slice(0, i),
        `${precipitationDaily[i]}%`,
        ...prevPrecipitation.slice(i + 1)
      ])

      setTempMinDays((prevTempMin) => [
        ...prevTempMin.slice(0, i),
        `${temperaturesDailyMin[i]}°C`,
        ...prevTempMin.slice(i + 1)
      ])

      setTempMaxDays((prevTempMax) => [
        ...prevTempMax.slice(0, i),
        `${temperaturesDailyMax[i]}°C`,
        ...prevTempMax.slice(i + 1)
      ])

      setImgDays((prevImg) => [
        ...prevImg.slice(0, i),
        getImage(weatherIdsDaily[i], '1', '0', '0', false).imgSrc,
        ...prevImg.slice(i + 1)
      ])
    }

    setDataChart1(chartData1)
    setDataChart2(chartData2)
    if (minutely) setMinutelyData(minutely)
  }

  const fetchDataCurrent = async (cityName: string, data: WeatherData, data2: WeatherData2) => {
    console.log('fetchDataCurrent called with:', { cityName, data, data2 })
    
    // Add comprehensive null/undefined checks
    if (!data) {
      console.error('No weather data provided')
      setError('Weather data not available...')
      return
    }
    
    if (!data.current) {
      console.error('No current weather data available')
      setError('Current weather data not available...')
      return
    }
    
    if (!data.current.weather || !Array.isArray(data.current.weather) || data.current.weather.length === 0) {
      console.error('No weather array found or weather array is empty:', data.current.weather)
      setError('Weather information not available...')
      return
    }

    const { current, alerts, timezone_offset: timezoneOffset } = data
    const weatherId = current.weather[0].id
    const windDeg = current.wind_deg || 0
    const date = new Date()
    const timezoneOffsetMinutes = timezoneOffset / 60
    const timezoneOffsetHours = timezoneOffset / 3600
    const utcDate = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    )
    const localDate = new Date(utcDate.getTime() + (timezoneOffsetHours * 60 * 60 * 1000))
    const localTime = localDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    const sunriseUTC = new Date(current.sunrise * 1000 || 0)
    const sunsetUTC = new Date(current.sunset * 1000 || 0)
    const offsetMilliseconds = (date.getTimezoneOffset() + timezoneOffsetMinutes) * 60 * 1000
    const sunriseLocal = new Date(sunriseUTC.getTime() + offsetMilliseconds)
    const sunsetLocal = new Date(sunsetUTC.getTime() + offsetMilliseconds)
    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }
    const sunUp = sunriseLocal.toLocaleTimeString('en-US', timeOptions)
    const sunDown = sunsetLocal.toLocaleTimeString('en-US', timeOptions)
    const name = cityName
    const result = getImage(weatherId, sunDown, sunUp, localTime, true)
    const { imgSrc, backgroundColor } = result

    setSunrise(sunUp)
    setSunset(sunDown)
    setTime(localTime)
    setCity(name)
    setTemperature(`${+current.temp.toFixed(1)}°C`)
    setDescription(current.weather[0].description)
    setFeelsLike(`${+current.feels_like.toFixed(0)}°C`)
    setHumidity(`${current.humidity}%`)
    setWind(`${+(3.6 * current.wind_speed).toFixed(0)}km/h`)
    setWindDirection(windDeg + 180)
    setPressure(`${current.pressure}hPa`)
    setUv(+current.uvi.toFixed(0))
    setCityLatitude(data.lat)
    setCityLongitude(data.lon)
    setMainImg(<Image
      src={imgSrc}
      className="mainImg"
      alt={current.weather[0].description}
      width={96}
      height={90}
    />)

    if (alerts && Array.isArray(alerts)) {
      if (alerts.some((alert: WeatherAlert) => alert.event && alert.event.includes('thunder'))) setThunderMessage('THUNDERSTORM WARNING')
      if (alerts.some((alert: WeatherAlert) => alert.event && (alert.event.includes('high-temperature') || alert.event.includes('heat')))) setHeatMessage('HIGH TEMPERATURE WARNING')
      if (alerts.some((alert: WeatherAlert) => alert.event && alert.event.includes('flooding'))) setFloodMessage('FLOOD WARNING')
      if (alerts.some((alert: WeatherAlert) => alert.event && alert.event.includes('snow-ice'))) setIceMessage('ICE WARNING')
    }

    document.body.style.background = backgroundColor
    localStorage.setItem('city', name)

    await fetchDataForecasts(data, sunDown, sunUp)
    if (data.daily && data.daily[0] && data.daily[0].moon_phase !== undefined) {
      await fetchDataMoon(data.daily[0].moon_phase)
    }
    if (data2 && data2.list && data2.list[0] && data2.list[0].main && data2.list[0].main.aqi) {
      await fetchDataAirPollution(data2.list[0].main.aqi)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (city === '' || /^[0-9]+$/.test(city)) {
      setError('Please enter a valid city...');
      return;
    }

    setLoading(true);
    setError('');
    setWeatherData(null);

    try {
      const response = await fetch('/api/weather/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          city: city
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch weather data');
      }
      
      await fetchDataCurrent(data.city, data.oneCallData, data.airPollutionData);
      setShowComponents(true);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'City not found or API error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const geolocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude } = position.coords
        const { longitude } = position.coords
        
        setLoading(true);
        setError('');
        
        try {
          const response = await fetch('/api/weather/geolocation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              latitude, longitude
            })
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to get location weather');
          }
          
          const { city, oneCallData, airPollutionData } = data;
          await fetchDataCurrent(city, oneCallData, airPollutionData);
          setShowComponents(true);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'A problem occurred during geolocation...';
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      }, () => {
        setError('Please enable geolocation on your device for this site...')
      })
    } else {
      setError('Your browser does not support geolocation...')
    }
  }

  const handleUnity = () => {
    if (temperature?.endsWith('C')) {
      const temperatureInCelsius = +(temperature.slice(0, -2))
      const temperatureInFahrenheit = (temperatureInCelsius * 1.8 + 32).toFixed(1)
      setTemperature(`${temperatureInFahrenheit}°F`)
      const feelsLikeInCelsius = +(feelsLike.slice(0, -2))
      const feelsLikeInFahrenheit = (feelsLikeInCelsius * 1.8 + 32).toFixed(0)
      setFeelsLike(`${feelsLikeInFahrenheit}°F`)
      const windInKilometersPerHour = +(wind.slice(0, -4))
      const windInMilesPerHour = (windInKilometersPerHour / 1.609).toFixed(0)
      setWind(`${windInMilesPerHour}mph`)
      setTempMinDays(tempMinDays.map((temp) => `${((temp.slice(0, -2)) * 1.8 + 32).toFixed(0)}°F`))
      setTempMaxDays(tempMaxDays.map((temp) => `${((temp.slice(0, -2)) * 1.8 + 32).toFixed(0)}°F`))
      setDataChart1(dataChart1?.map((item) => ({
        ...item,
        temp: +(item.temp * 1.8 + 32).toFixed(1),
        wind: +(item.wind / 1.609).toFixed(0)
      })))
      setDataChart2(dataChart2?.map((item) => ({
        ...item,
        temp: +(item.temp * 1.8 + 32).toFixed(1),
        wind: +(item.wind / 1.609).toFixed(0)
      })))
    } else {
      const temperatureInFahrenheit = +(temperature.slice(0, -2))
      const temperatureInCelsius = ((temperatureInFahrenheit - 32) / 1.8).toFixed(1)
      setTemperature(`${temperatureInCelsius}°C`)
      const feelsLikeInFahrenheit = +(feelsLike.slice(0, -2))
      const feelsLikeInCelsius = ((feelsLikeInFahrenheit - 32) / 1.8).toFixed(0)
      setFeelsLike(`${feelsLikeInCelsius}°C`)
      const windInMilesPerHour = +(wind.slice(0, -3))
      const windInKilometersPerHour = (windInMilesPerHour * 1.609).toFixed(0)
      setWind(`${windInKilometersPerHour}km/h`)
      setTempMinDays(tempMinDays.map((temp) => `${(((temp.slice(0, -2)) - 32) / 1.8).toFixed(0)}°C`))
      setTempMaxDays(tempMaxDays.map((temp) => `${(((temp.slice(0, -2)) - 32) / 1.8).toFixed(0)}°C`))
      setDataChart1(dataChart1?.map((item) => ({
        ...item,
        temp: +((item.temp - 32) / 1.8).toFixed(1),
        wind: +(item.wind * 1.609).toFixed(0)
      })))
      setDataChart2(dataChart2?.map((item) => ({
        ...item,
        temp: +((item.temp - 32) / 1.8).toFixed(1),
        wind: +(item.wind * 1.609).toFixed(0)
      })))
    }
  }

  return (
    <div className="weather-component w-full h-full">
      <header className="mb-4">
        <Title level={4} className="flex items-center text-blue-600 mb-2">
          <EnvironmentOutlined className="mr-2" /> Weather Information
        </Title>
        {!showComponents && (
          <Text className="text-gray-500">Enter a location to check current weather conditions</Text>
        )}
        {showComponents && (
          <div className="flex justify-between items-center">
            <Text className="text-gray-600 text-base">
              {time} | ARDABIL
            </Text>
            <Button
              type="text"
              onClick={handleUnity}
              shape="circle"
              icon={<span className="text-blue-600">{temperature?.endsWith('C') ? '°F' : '°C'}</span>}
            />
          </div>
        )}
      </header>

      {error && (
        <Alert 
          message={error} 
          type="error" 
          showIcon 
          className="mb-4" 
          closable 
        />
      )}

      <main>
        {!showComponents ? (
          <Card className="mb-4 bg-gray-50 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Enter city (e.g. Tehran)"
                size="large"
                prefix={<SearchOutlined className="text-gray-400" />}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={loading}
                className="rounded-lg"
              />
              <Row gutter={16}>
                <Col span={12}>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    block
                    size="large"
                    loading={loading}
                    className="bg-blue-500 hover:bg-blue-600 border-blue-500"
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                </Col>
                <Col span={12}>
                  <Button 
                    block 
                    size="large"
                    onClick={geolocation}
                    disabled={loading}
                    icon={<EnvironmentOutlined />}
                  >
                    {loading ? 'Getting location...' : 'Use Current Location'}
                  </Button>
                </Col>
              </Row>
            </form>
          </Card>
        ) : (
          <>
            {/* Weather Alerts Section */}
            {(thunderMessage || heatMessage || floodMessage || iceMessage) && (
              <Card className="mb-4 bg-amber-50 border border-amber-200">
                <Space direction="vertical" className="w-full">
                  {thunderMessage && <Alert message={thunderMessage} type="warning" showIcon />}
                  {heatMessage && <Alert message={heatMessage} type="warning" showIcon />}
                  {floodMessage && <Alert message={floodMessage} type="warning" showIcon />}
                  {iceMessage && <Alert message={iceMessage} type="warning" showIcon />}
                </Space>
              </Card>
            )}

            {/* Current Weather Section */}
            <Card className="mb-4 shadow-sm border border-gray-200">
              <Row gutter={24} align="middle">
                <Col xs={24} sm={8} className="text-center">
                  {/* Replace mainImg with an emoji representation */}
                  <div className="flex justify-center">
                    <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-4xl">
                        {description?.includes('rain') ? '🌧️' : 
                         description?.includes('cloud') ? '☁️' : 
                         description?.includes('snow') ? '❄️' : 
                         description?.includes('thunder') ? '⚡' : '☀️'}
                      </span>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={16}>
                  <div className="text-center sm:text-left">
                    <Title level={1} className="mb-0 text-blue-600">{temperature}</Title>
                    <Title level={5} className="capitalize mt-0 text-gray-600">{description}</Title>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <Text className="text-gray-500">Feels like</Text>
                        <div className="text-xl font-bold text-gray-700">{feelsLike}</div>
                      </div>
                      <div>
                        <Text className="text-gray-500">UV Index</Text>
                        <div className="text-xl font-bold text-gray-700">{uv}</div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              
              <Divider className="my-4" />
              
              <Row gutter={[16, 16]} className="text-center">
                <Col span={8}>
                  <Text className="text-gray-500 block">Humidity</Text>
                  <div className="text-lg font-semibold text-gray-700">{humidity}</div>
                </Col>
                <Col span={8}>
                  <Text className="text-gray-500 block">Wind</Text>
                  <div className="text-lg font-semibold text-gray-700 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 50 50" className="mr-1">
                      <path d="M25 5 L40 45 L25 35 L10 45 Z" fill="currentColor" transform={`rotate(${windDirection}, 25, 25)`} />
                    </svg>
                    {wind}
                  </div>
                </Col>
                <Col span={8}>
                  <Text className="text-gray-500 block">Pressure</Text>
                  <div className="text-lg font-semibold text-gray-700">{pressure}</div>
                </Col>
              </Row>
            </Card>

            {/* Precipitation Section */}
            {/* <Card className="mb-4 shadow-sm border border-gray-200">
              <RainJauge minutely={minutelyData} />
            </Card> */}
            
            {/* Forecast Charts */}
            <Card className="mb-4 shadow-sm border border-gray-200">
              <Title level={5} className="text-blue-600 mb-3">Hourly Forecast</Title>
              
              {dataChart1?.length > 0 && (
                <div className="mb-4">
                  <Text className="text-gray-600 font-medium block mb-2">Today</Text>
                  <ResponsiveContainer width="100%" height={100}>
                    <LineChart
                      data={dataChart1}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <XAxis dataKey="name" axisLine={false} tick={{fontSize: 10}} />
                      <YAxis yAxisId="temperature" domain={['dataMin', 'dataMax']} hide />
                      <YAxis yAxisId="precipitation" hide />
                      <Tooltip
                        content={<CustomTooltip temperature={temperature} />}
                        wrapperStyle={{ zIndex: '999' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="temp"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                        yAxisId="temperature"
                      />
                      <Line
                        type="monotone"
                        dataKey="precipitation"
                        stroke="#60a5fa"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                        yAxisId="precipitation"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex justify-between mt-1">
                    {dataChart1?.slice(0, 12).map((item, idx) => (
                      <div key={idx} className="flex justify-center">
                        <Image
                          src={getImage(item.weather, item.sunDownH, item.sunUpH, item.name, false).imgSrc}
                          alt={item.description}
                          width={16}
                          height={15}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <Text className="text-gray-600 font-medium block mb-2">Tomorrow</Text>
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart
                    data={dataChart2}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <XAxis dataKey="name" axisLine={false} tick={{fontSize: 10}} />
                    <YAxis yAxisId="temperature" domain={['dataMin', 'dataMax']} hide />
                    <YAxis yAxisId="precipitation" hide />
                    <Tooltip
                      content={<CustomTooltip temperature={temperature} />}
                      wrapperStyle={{ zIndex: '999' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="temp"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      yAxisId="temperature"
                    />
                    <Line
                      type="monotone"
                      dataKey="precipitation"
                      stroke="#60a5fa"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      yAxisId="precipitation"
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex justify-between mt-1">
                  {dataChart2?.slice(0, 12).map((item, idx) => (
                    <div key={idx} className="flex justify-center">
                      <Image
                        src={getImage(item.weather, item.sunDownH, item.sunUpH, item.name, false).imgSrc}
                        alt={item.description}
                        width={16}
                        height={15}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            
            {/* Weekly Forecast */}
            {/* <Card className="mb-4 shadow-sm border border-gray-200">
              <Title level={5} className="text-blue-600 mb-3">7-Day Forecast</Title>
              <div className="overflow-x-auto">
                <div className="flex min-w-max">
                  {days.slice(0, -1).map((day, index) => (
                    <div key={index} className="w-20 mx-1 text-center">
                      <div className="mb-2 font-semibold">{day}</div>
                      <div className="mb-2">
                        <div className="h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                          <span className="text-blue-500 text-xs">
                            {index % 3 === 0 ? '☀️' : index % 3 === 1 ? '⛅' : '🌧️'}
                          </span>
                        </div>
                      </div>
                      <div className="mb-2 text-sm">
                        <span className="font-medium text-gray-800">
                          {tempMaxDays && tempMaxDays[index] ? tempMaxDays[index] : mockForecastData.tempMaxDays[index]}
                        </span>
                        <span className="text-gray-500 mx-1">/</span>
                        <span className="text-gray-600">
                          {tempMinDays && tempMinDays[index] ? tempMinDays[index] : mockForecastData.tempMinDays[index]}
                        </span>
                      </div>
                      <div className="text-sm flex items-center justify-center text-blue-500">
                        <BsCloudRainHeavyFill className="mr-1" />
                        <span>
                          {precipitationDays && precipitationDays[index] ? precipitationDays[index] : mockForecastData.precipitationDays[index]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card> */}
            
            {/* Additional Info */}
            <Card className="shadow-sm border border-gray-200">
              <Title level={5} className="text-blue-600 mb-3">Additional Information</Title>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={8} md={6}>
                  <Card size="small" className="text-center h-full">
                    <Text className="text-gray-500 block">Air Quality</Text>
                    <div className="text-base font-semibold text-gray-700 mt-1">{airPollution}</div>
                  </Card>
                </Col>
                <Col xs={12} sm={8} md={6}>
                  <Card size="small" className="text-center h-full">
                    <Text className="text-gray-500 block">Moon Phase</Text>
                    <div className="text-xl text-gray-700 mt-1 flex justify-center">{moonPhase}</div>
                  </Card>
                </Col>
                <Col xs={12} sm={8} md={6}>
                  <Card size="small" className="text-center h-full">
                    <Text className="text-gray-500 block">Sunrise</Text>
                    <div className="text-base font-semibold text-gray-700 mt-1 flex items-center justify-center">
                      <BsFillSunriseFill className="text-amber-500 mr-1" />
                      {sunrise}
                    </div>
                  </Card>
                </Col>
                <Col xs={12} sm={8} md={6}>
                  <Card size="small" className="text-center h-full">
                    <Text className="text-gray-500 block">Sunset</Text>
                    <div className="text-base font-semibold text-gray-700 mt-1 flex items-center justify-center">
                      <BsFillSunsetFill className="text-orange-500 mr-1" />
                      {sunset}
                    </div>
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                  <Card size="small" className="text-center h-full">
                    <Text className="text-gray-500 block">Longitude</Text>
                    <div className="text-base font-semibold text-gray-700 mt-1">{cityLongitude}</div>
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                  <Card size="small" className="text-center h-full">
                    <Text className="text-gray-500 block">Latitude</Text>
                    <div className="text-base font-semibold text-gray-700 mt-1">{cityLatitude}</div>
                  </Card>
                </Col>
              </Row>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}
