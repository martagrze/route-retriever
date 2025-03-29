// Google Maps API types
export interface RoutesResponse {
  routes: {
    distanceMeters: number;
    duration: string;
    polyline: {
      encodedPolyline: string;
    };
    legs: {
      startLocation: {
        latLng: {
          latitude: number;
          longitude: number;
        };
      };
      endLocation: {
        latLng: {
          latitude: number;
          longitude: number;
        };
      };
    }[];
  }[];
}

export interface RouteDetails {
  totalDistance: number; // in kilometers
  totalDuration: number; // in minutes
  legs: {
    startAddress: string;
    endAddress: string;
    distance: number; // in kilometers
    duration: number; // in minutes
  }[];
  polyline: string;
}

// API key input state - for demonstration purposes
let apiKey = '';
export const setApiKey = (key: string) => {
  apiKey = key;
};

export const getApiKey = () => apiKey;

// Calculate route using Google Maps Routes API
export const calculateRoute = async (
  origin: string, 
  destination: string
): Promise<RouteDetails> => {
  // Check if API key is available
  if (!apiKey) {
    // For demo purposes, fall back to mock data if no API key
    return calculateMockRoute(origin, destination);
  }
  
  try {
    // Outbound journey (A to B)
    const outboundResponse = await fetchRoute(origin, destination);
    
    // Return journey (B to A)
    const returnResponse = await fetchRoute(destination, origin);
    
    // Process both journeys
    const outboundLeg = processRouteLeg(outboundResponse.routes[0], origin, destination);
    const returnLeg = processRouteLeg(returnResponse.routes[0], destination, origin);
    
    // Combine data
    return {
      totalDistance: outboundLeg.distance + returnLeg.distance,
      totalDuration: outboundLeg.duration + returnLeg.duration,
      legs: [outboundLeg, returnLeg],
      polyline: outboundResponse.routes[0].polyline.encodedPolyline
    };
  } catch (error) {
    console.error('Error fetching route:', error);
    throw new Error('Failed to calculate route. Please check your addresses and try again.');
  }
};

// Helper function to fetch routes from the API
const fetchRoute = async (origin: string, destination: string): Promise<RoutesResponse> => {
  const url = new URL('https://routes.googleapis.com/directions/v2:computeRoutes');
  
  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': apiKey,
    'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline,routes.legs.startLocation,routes.legs.endLocation'
  };

  const data = {
    origin: {
      address: origin
    },
    destination: {
      address: destination
    },
    travelMode: "DRIVE",
    routingPreference: "TRAFFIC_AWARE",
    computeAlternativeRoutes: false,
    routeModifiers: {
      avoidTolls: false,
      avoidHighways: false,
      avoidFerries: false
    }
  };
  
  // Note: Due to CORS restrictions, this request would normally need to be proxied through a server
  // For direct client-side implementation, consider using the Google Maps JavaScript API instead
  // This code assumes you have a server-side proxy or are using this in a Node.js environment
  
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`Routes API returned ${response.status}: ${response.statusText}`);
  }
  
  return await response.json();
};

// Process a leg of the journey from Routes API response
const processRouteLeg = (route: RoutesResponse['routes'][0], startAddress: string, endAddress: string) => {
  const distanceKm = route.distanceMeters / 1000;
  
  // Parse duration string (format: "123s" or "1h2m3s")
  let durationMinutes = 0;
  const durationStr = route.duration;
  
  if (durationStr.includes('h')) {
    const hours = parseInt(durationStr.split('h')[0]);
    durationMinutes += hours * 60;
    const remainder = durationStr.split('h')[1];
    
    if (remainder.includes('m')) {
      const minutes = parseInt(remainder.split('m')[0]);
      durationMinutes += minutes;
    }
  } else if (durationStr.includes('m')) {
    const minutes = parseInt(durationStr.split('m')[0]);
    durationMinutes += minutes;
  } else if (durationStr.includes('s')) {
    const seconds = parseInt(durationStr.split('s')[0]);
    durationMinutes += seconds / 60;
  }
  
  return {
    startAddress,
    endAddress,
    distance: distanceKm,
    duration: durationMinutes
  };
};

// Mock implementation for demonstration or when API key is not available
const calculateMockRoute = async (
  origin: string, 
  destination: string
): Promise<RouteDetails> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock distance (in meters)
  const distanceToBInMeters = Math.floor(Math.random() * 20000) + 5000; // 5-25 km
  const distanceToAInMeters = Math.floor(Math.random() * 20000) + 5000; // 5-25 km
  
  // Mock duration (in seconds)
  const durationToBInSeconds = distanceToBInMeters / 13.89; // Approx 50 km/h
  const durationToAInSeconds = distanceToAInMeters / 13.89; // Approx 50 km/h
  
  return {
    totalDistance: (distanceToBInMeters + distanceToAInMeters) / 1000, // Convert to km
    totalDuration: (durationToBInSeconds + durationToAInSeconds) / 60, // Convert to minutes
    legs: [
      {
        startAddress: origin,
        endAddress: destination,
        distance: distanceToBInMeters / 1000, // Convert to km
        duration: durationToBInSeconds / 60, // Convert to minutes
      },
      {
        startAddress: destination,
        endAddress: origin,
        distance: distanceToAInMeters / 1000, // Convert to km
        duration: durationToAInSeconds / 60, // Convert to minutes
      }
    ],
    polyline: "mock_polyline_string"
  };
};

// In a real implementation, we would need to implement this function
// to actually decode the polyline into coordinates
export const decodePolyline = (polyline: string): { lat: number; lng: number }[] => {
  // This is a mock implementation
  // For a real app, implement the actual Google polyline decoding algorithm
  
  // For our mock, we'll just return some hardcoded coordinates for a route
  return [
    { lat: 37.7749, lng: -122.4194 }, // San Francisco
    { lat: 37.8, lng: -122.4 },
    { lat: 37.85, lng: -122.45 },
    { lat: 37.9, lng: -122.5 },
    { lat: 38.0, lng: -122.4 },
    { lat: 38.1, lng: -122.3 },
    { lat: 38.2, lng: -122.2 },
    { lat: 38.3, lng: -122.1 },
    { lat: 38.4, lng: -122.0 },
    { lat: 38.5, lng: -121.9 },
    { lat: 38.57, lng: -121.47 } // Sacramento
  ];
};

// Google Places Autocomplete API
export interface PlacesAutocompleteResult {
  predictions: {
    place_id: string;
    description: string;
    structured_formatting: {
      main_text: string;
      secondary_text: string;
    };
  }[];
  status: string;
}

export const getPlacesAutocomplete = async (input: string): Promise<PlacesAutocompleteResult> => {
  if (!apiKey || !input || input.length < 2) {
    return { predictions: [], status: "ZERO_RESULTS" };
  }
  
  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
    url.searchParams.append('input', input);
    url.searchParams.append('types', 'address');
    url.searchParams.append('key', apiKey);
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Places API returned ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching places autocomplete:', error);
    return { predictions: [], status: "ERROR" };
  }
};
