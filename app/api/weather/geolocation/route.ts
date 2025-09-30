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
    const { latitude, longitude } = await request.json();
    
    if (!latitude || !longitude) {
      return NextResponse.json({ error: 'Coordinates are required' }, { status: 400 });
    }

    let cityName = 'Current Location';
    
    // Try to get city name from coordinates
    try {
      const geoResponse = await fetchWithTimeout(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`,
        5000,
        0
      );
      
      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        if (geoData.length > 0) {
          const { name, country } = geoData[0];
          cityName = country ? `${name}, ${country}` : name;
        }
      }
    } catch (error) {
      console.log('Using fallback city name due to reverse geocoding failure');
    }
    
    // Get weather data using One Call API
    const weatherResponse = await fetchWithTimeout(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`,
      10000,
      1
    );
    
    if (!weatherResponse.ok) {
      const errorText = await weatherResponse.text();
      throw new Error(`Weather API failed: ${weatherResponse.status} ${errorText}`);
    }
    
    const weatherData = await weatherResponse.json();
    
    // Try to get air pollution data (optional)
    let airPollutionData = { list: [{ main: { aqi: 1 } }] }; // Default fallback
    try {
      const airResponse = await fetchWithTimeout(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`,
        5000,
        0
      );
      
      if (airResponse.ok) {
        airPollutionData = await airResponse.json();
      }
    } catch (error) {
      console.log('Air pollution data unavailable, using fallback');
    }
    
    // Add coordinates to weather data
    weatherData.lat = latitude.toString();
    weatherData.lon = longitude.toString();
    
    return NextResponse.json({
      city: cityName,
      oneCallData: weatherData,
      airPollutionData: airPollutionData
    });
    
  } catch (error) {
    console.error('Geolocation weather API error:', error);
    
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
 