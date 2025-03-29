
// Google Maps API types
export interface DirectionsResult {
  routes: {
    legs: {
      distance: {
        text: string;
        value: number;  // in meters
      };
      duration: {
        text: string;
        value: number;  // in seconds
      };
      start_address: string;
      end_address: string;
    }[];
    overview_polyline: {
      points: string;
    };
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

// Calculate route using Google Maps Directions API
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
    const outboundResponse = await fetchDirections(origin, destination);
    
    // Return journey (B to A)
    const returnResponse = await fetchDirections(destination, origin);
    
    // Process both journeys
    const outboundLeg = processLeg(outboundResponse.routes[0].legs[0], origin, destination);
    const returnLeg = processLeg(returnResponse.routes[0].legs[0], destination, origin);
    
    // Combine data
    return {
      totalDistance: outboundLeg.distance + returnLeg.distance,
      totalDuration: outboundLeg.duration + returnLeg.duration,
      legs: [outboundLeg, returnLeg],
      polyline: outboundResponse.routes[0].overview_polyline.points
    };
  } catch (error) {
    console.error('Error fetching directions:', error);
    throw new Error('Failed to calculate route. Please check your addresses and try again.');
  }
};

// Helper function to fetch directions from the API
const fetchDirections = async (origin: string, destination: string): Promise<DirectionsResult> => {
  const url = new URL('https://maps.googleapis.com/maps/api/directions/json');
  url.searchParams.append('origin', origin);
  url.searchParams.append('destination', destination);
  url.searchParams.append('mode', 'driving');
  url.searchParams.append('key', apiKey);
  
  // Note: Due to CORS restrictions, this request would normally need to be proxied through a server
  // For direct client-side implementation, consider using the Google Maps JavaScript API instead
  // This code assumes you have a server-side proxy or are using this in a Node.js environment
  
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Directions API returned ${response.status}: ${response.statusText}`);
  }
  
  return await response.json();
};

// Process a leg of the journey
const processLeg = (leg: DirectionsResult['routes'][0]['legs'][0], startAddress: string, endAddress: string) => {
  return {
    startAddress,
    endAddress,
    distance: leg.distance.value / 1000, // Convert to km
    duration: leg.duration.value / 60 // Convert to minutes
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
