
import React, { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";

interface RouteMapProps {
  originAddress?: string;
  destinationAddress?: string;
  polyline?: string;
}

const RouteMap = ({ originAddress, destinationAddress, polyline }: RouteMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // In a real implementation, this would initialize and update a Google Map
    // For this demo, we'll just show a placeholder
    if (mapRef.current) {
      const mapElement = mapRef.current;
      
      // Clear previous content
      mapElement.innerHTML = '';
      
      if (originAddress && destinationAddress) {
        // Create a styled placeholder
        mapElement.innerHTML = `
          <div class="flex items-center justify-center h-full w-full bg-gray-100 text-gray-500 flex-col p-4">
            <p class="text-center mb-4">Map Visualization Placeholder</p>
            <div class="w-4/5 h-4/5 flex flex-col items-center justify-center">
              <div class="flex items-center w-full mb-6">
                <div class="h-4 w-4 rounded-full bg-blue-500 flex-shrink-0"></div>
                <div class="h-1 flex-grow bg-blue-300 mx-2"></div>
                <div class="h-4 w-4 rounded-full bg-red-500 flex-shrink-0"></div>
              </div>
              <div class="flex items-center w-full">
                <div class="h-4 w-4 rounded-full bg-red-500 flex-shrink-0"></div>
                <div class="h-1 flex-grow bg-blue-300 mx-2"></div>
                <div class="h-4 w-4 rounded-full bg-blue-500 flex-shrink-0"></div>
              </div>
              <div class="mt-6 text-center text-sm">
                <p><span class="font-semibold">From:</span> ${originAddress}</p>
                <p><span class="font-semibold">To:</span> ${destinationAddress}</p>
                <p><span class="font-semibold">And back to:</span> ${originAddress}</p>
              </div>
            </div>
          </div>
        `;
      } else {
        // Show a message when no route is selected
        mapElement.innerHTML = `
          <div class="flex items-center justify-center h-full w-full bg-gray-100 text-gray-500">
            <p class="text-center">Enter addresses to see the route map</p>
          </div>
        `;
      }
    }
  }, [originAddress, destinationAddress, polyline]);
  
  return (
    <Card className="w-full overflow-hidden">
      <div ref={mapRef} className="h-[400px] w-full"></div>
    </Card>
  );
};

export default RouteMap;
