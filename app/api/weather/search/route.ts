import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHER_API_KEY || "afe405b6f47fc44f4d31905e75906f89";

// Helper function for fetch with timeout and retry
async function fetchWithTimeout(url: string, timeout = 8000, retries = 1): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'WeatherApp/1.0',
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (i === retries) throw error;
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  throw new Error('Max retries exceeded');
}

export async function POST(request: NextRequest) {
  try {
    const { city } = await request.json();
    
    if (!city) {
      return NextResponse.json({ error: 'City is required' }, { status: 400 });
    }

    // Get coordinates from city name
    const geoResponse = await fetchWithTimeout(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`,
      6000,
      1
    );
    
    if (!geoResponse.ok) {
      const errorText = await geoResponse.text();
      throw new Error(`Geocoding failed: ${geoResponse.status} ${errorText}`);
    }
    
    const geoData = await geoResponse.json();
    
    if (geoData.length === 0) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }
    
    const { lat, lon, name, country } = geoData[0];
    const cityName = country ? `${name}, ${country}` : name;

    // --- Use free APIs instead of One Call 3.0 ---
    // Get current weather
    const currentResponse = await fetchWithTimeout(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
      8000,
      1
    );
    
    if (!currentResponse.ok) {
      const errorText = await currentResponse.text();
      throw new Error(`Current weather API failed: ${currentResponse.status} ${errorText}`);
    }
    
    const currentData = await currentResponse.json();

    // Get hourly forecast (next 5 days, every 3 hours)
    const forecastResponse = await fetchWithTimeout(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
      8000,
      1
    );
    
    let hourly: any[] = [];
    if (forecastResponse.ok) {
      const forecastData = await forecastResponse.json();
      hourly = forecastData.list.map((item: any) => ({
        dt: item.dt,
        weather: item.weather,
        temp: item.main.temp,
        humidity: item.main.humidity,
        pressure: item.main.pressure,
        wind_speed: item.wind.speed,
        wind_deg: item.wind.deg,
        pop: item.pop || 0,
        uvi: 0,
        rain: item.rain,
      }));
    }

    // Try to get air pollution data (optional)
    let airPollutionData = { list: [{ main: { aqi: 1 } }] };
    try {
      const airResponse = await fetchWithTimeout(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
        5000,
        0
      );
      
      if (airResponse.ok) {
        airPollutionData = await airResponse.json();
      }
    } catch (error) {
      console.log('Air pollution data unavailable, using fallback');
    }

    // Transform to match frontend expectations
    const weatherData = {
      lat: lat.toString(),
      lon: lon.toString(),
      timezone: "UTC",
      timezone_offset: 0,
      current: {
        weather: currentData.weather,
        wind_deg: currentData.wind?.deg || 0,
        sunrise: currentData.sys?.sunrise || 0,
        sunset: currentData.sys?.sunset || 0,
        temp: currentData.main?.temp || 0,
        feels_like: currentData.main?.feels_like || 0,
        humidity: currentData.main?.humidity || 0,
        pressure: currentData.main?.pressure || 0,
        wind_speed: currentData.wind?.speed || 0,
        uvi: 0,
      },
      hourly: hourly.slice(0, 24), // Only next 24 periods (3-hourly)
      daily: [], // Not available in free API
      minutely: [], // Not available in free API
      alerts: [],
    };

    return NextResponse.json({
      city: cityName,
      oneCallData: weatherData,
      airPollutionData: airPollutionData
    });
    
  } catch (error) {
    console.error('Weather search API error:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('aborted')) {
        return NextResponse.json({ error: 'Request timeout - please check your connection' }, { status: 504 });
      }
      if (error.message.includes('401')) {
        return NextResponse.json({ error: 'API authentication failed' }, { status: 401 });
      }
    }
    
    return NextResponse.json({ error: 'Unable to fetch weather data. Please try again.' }, { status: 500 });
  }
}
