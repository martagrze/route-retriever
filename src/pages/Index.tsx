
import React, { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { calculateRoute, RouteDetails as RouteDetailsType } from "@/utils/googleMapsAPI";
import AddressForm from "@/components/AddressForm";
import RouteMap from "@/components/RouteMap";
import RouteDetails from "@/components/RouteDetails";
import AppHeader from "@/components/AppHeader";

const Index = () => {
  const [originAddress, setOriginAddress] = useState<string>('');
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [routeDetails, setRouteDetails] = useState<RouteDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculateRoute = async (origin: string, destination: string) => {
    try {
      setIsLoading(true);
      setOriginAddress(origin);
      setDestinationAddress(destination);
      
      const details = await calculateRoute(origin, destination);
      setRouteDetails(details);
      
      toast({
        title: "Route calculated!",
        description: `The round trip is ${details.totalDistance.toFixed(1)} km.`,
      });
    } catch (error) {
      console.error("Error calculating route:", error);
      toast({
        title: "Error calculating route",
        description: "Please check the addresses and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-4xl mx-auto px-4">
        <AppHeader />
        
        <div className="grid gap-6 mb-8">
          <AddressForm 
            onCalculate={handleCalculateRoute}
            isLoading={isLoading}
          />
          
          <RouteMap 
            originAddress={originAddress}
            destinationAddress={destinationAddress}
            polyline={routeDetails?.polyline}
          />
          
          {routeDetails && (
            <RouteDetails routeDetails={routeDetails} />
          )}
        </div>
        
        <footer className="text-center text-gray-500 text-sm py-8">
          <p>© 2023 Route Retriever • Default settings: Car, Fastest Route</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
