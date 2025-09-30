interface GeocodingData {
  name: string
  country: string
}

interface ForecastEntry {
  dt_txt: string
  main: {
    temp: number
    humidity: number
    pressure: number
  }
  wind: {
    speed: number
    deg: number
  }
  weather: {
    description: string
  }[]
}

interface WeatherData {
  list: ForecastEntry[]
}

interface AirPollutionData {
  list: {
    main: {
      aqi: number
    }
  }[]
}

interface FetchWeatherDataResponse {
  city: string
  weatherData: WeatherData
  airPollutionData: AirPollutionData
}

interface RequestBody {
  latitude: string
  longitude: string
}

interface Request {
  method: string
  body: RequestBody
}

interface Response {
  status: (code: number) => Response
  json: (data: unknown) => void
  send: (data: string) => void
}

const fetchWeatherData = async (latitude: string, longitude: string): Promise<FetchWeatherDataResponse> => {
  'use server'
  const key = process.env.API_KEY

  // Reverse geocoding to get city name
  const geoRes = await fetch(
    `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${key}`
  )

  if (!geoRes.ok) {
    throw new Error('Reverse Geocoding API request failed')
  }

  const [geoData] = (await geoRes.json()) as GeocodingData[]

  // Forecast & air pollution API calls (free)
  const [forecastRes, airRes] = await Promise.all([
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric&lang=en`
    ),
    fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${key}`
    ),
  ])

  if (!forecastRes.ok) {
    throw new Error('Forecast API request failed')
  }

  if (!airRes.ok) {
    throw new Error('Air Pollution API request failed')
  }

  const forecastData = (await forecastRes.json()) as WeatherData
  const airPollutionData = (await airRes.json()) as AirPollutionData

  return {
    city: `${geoData.name}, ${geoData.country}`,
    weatherData: forecastData,
    airPollutionData,
  }
}

export default async function handler(req: Request, res: Response): Promise<void> {
  if (req.method === 'POST') {
    const { latitude, longitude } = req.body
    try {
      const data = await fetchWeatherData(latitude, longitude)
      
      // Transform the forecast data to match expected OneCall structure
      const firstEntry = data.weatherData.list[0]
      
      const transformedData = {
        current: {
          weather: firstEntry.weather,
          wind_deg: firstEntry.wind.deg || 0,
          sunrise: Date.now() / 1000,
          sunset: Date.now() / 1000 + 12 * 3600,
          temp: firstEntry.main.temp || 0,
          feels_like: firstEntry.main.temp - 2 || 0,
          humidity: firstEntry.main.humidity || 0,
          pressure: firstEntry.main.pressure || 0,
          wind_speed: firstEntry.wind.speed || 0,
          uvi: 0
        },
        hourly: data.weatherData.list.slice(0, 48).map(item => ({
          dt: new Date(item.dt_txt).getTime() / 1000,
          weather: item.weather || [],
          temp: item.main?.temp || 0,
          humidity: item.main?.humidity || 0,
          pressure: item.main?.pressure || 0,
          wind_speed: item.wind?.speed || 0,
          wind_deg: item.wind?.deg || 0,
          pop: 0,
          uvi: 0,
          rain: undefined
        })),
        daily: Array(8).fill(null).map((_, index) => ({
          dt: Date.now() / 1000 + index * 24 * 3600,
          temp: { 
            min: (firstEntry.main?.temp || 20) - 5, 
            max: (firstEntry.main?.temp || 20) + 5 
          },
          weather: firstEntry.weather || [],
          pop: 0.1,
          moon_phase: 0.5
        })),
        minutely: Array(60).fill({ dt: Date.now() / 1000, precipitation: 0 }),
        timezone: 'UTC',
        timezone_offset: 0,
        lat: latitude,
        lon: longitude,
        alerts: []
      }
      
      // Return consistent structure matching search API
      const response = {
        city: data.city,
        oneCallData: transformedData,
        airPollutionData: data.airPollutionData
      }
      
      res.status(200).json(response)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      res.status(400).json({ error: errorMessage })
    }
  } else {
    res.status(404).send('')
  }
}
