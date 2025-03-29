
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import AddressInputAutocomplete from './AddressInputAutocomplete';

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
          <AddressInputAutocomplete
            id="origin"
            label="Starting Point (A)"
            iconColor="text-blue-500"
            placeholder="Enter starting address"
            value={originAddress}
            onChange={setOriginAddress}
          />
          
          <AddressInputAutocomplete
            id="destination"
            label="Destination (B)"
            iconColor="text-red-500"
            placeholder="Enter destination address"
            value={destinationAddress}
            onChange={setDestinationAddress}
          />
          
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
