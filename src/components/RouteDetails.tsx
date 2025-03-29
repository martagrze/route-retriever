
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Navigation } from "lucide-react";
import { RouteDetails as RouteDetailsType } from "@/utils/googleMapsAPI";

interface RouteDetailsProps {
  routeDetails: RouteDetailsType | null;
}

const RouteDetails = ({ routeDetails }: RouteDetailsProps) => {
  if (!routeDetails) return null;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-blue-500" />
          Route Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <Navigation className="h-4 w-4 text-blue-500" />
              </div>
              <span className="font-medium">Total Distance</span>
            </div>
            <span className="text-xl font-bold">{routeDetails.totalDistance.toFixed(1)} km</span>
          </div>
          
          <div className="flex justify-between items-center border-b pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-100 rounded-full">
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <span className="font-medium">Total Duration</span>
            </div>
            <span className="text-xl font-bold">{Math.round(routeDetails.totalDuration)} mins</span>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Route Breakdown</h3>
            
            {routeDetails.legs.map((leg, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">
                    {index === 0 ? "Outbound: A → B" : "Return: B → A"}
                  </span>
                </div>
                <div className="pl-6 text-sm space-y-1 text-gray-600">
                  <div className="flex justify-between">
                    <span>Distance:</span>
                    <span className="font-medium">{leg.distance.toFixed(1)} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{Math.round(leg.duration)} mins</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteDetails;
