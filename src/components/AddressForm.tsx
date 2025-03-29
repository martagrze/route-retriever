
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, RotateCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AddressFormProps {
  onCalculate: (originAddress: string, destinationAddress: string) => void;
  isLoading: boolean;
}

const AddressForm = ({ onCalculate, isLoading }: AddressFormProps) => {
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (originAddress && destinationAddress) {
      onCalculate(originAddress, destinationAddress);
    }
  };
  
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="origin">
              <span className="flex items-center gap-1">
                <MapPin size={16} className="text-blue-500" />
                Starting Point (A)
              </span>
            </Label>
            <Input
              id="origin"
              placeholder="Enter starting address"
              value={originAddress}
              onChange={(e) => setOriginAddress(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destination">
              <span className="flex items-center gap-1">
                <MapPin size={16} className="text-red-500" />
                Destination (B)
              </span>
            </Label>
            <Input
              id="destination"
              placeholder="Enter destination address"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              'Calculate Round Trip (A → B → A)'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddressForm;
