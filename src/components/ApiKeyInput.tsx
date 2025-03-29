
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key } from "lucide-react";
import { getApiKey, setApiKey } from "@/utils/googleMapsAPI";
import { toast } from "@/components/ui/use-toast";

const ApiKeyInput = () => {
  const [key, setKey] = useState(getApiKey());
  const [isVisible, setIsVisible] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('google_maps_api_key');
    if (savedKey) {
      setKey(savedKey);
      setApiKey(savedKey);
    }
  }, []);

  const handleSaveKey = () => {
    setApiKey(key);
    localStorage.setItem('google_maps_api_key', key);
    toast({
      title: "API Key Saved",
      description: "Your Google Maps API key has been saved.",
    });
    setIsVisible(false);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (!isVisible && getApiKey()) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1 mb-4"
        onClick={toggleVisibility}
      >
        <Key size={14} />
        <span>Configure API Key</span>
      </Button>
    );
  }

  return (
    <Card className="w-full mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Key size={18} className="text-blue-500" />
          Google Maps API Configuration
        </CardTitle>
        <CardDescription>
          Enter your Google Maps API key to enable real route calculations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="text"
              placeholder="Enter your Google Maps API key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              The key will be stored in your browser's local storage.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSaveKey} disabled={!key}>
              Save Key
            </Button>
            {getApiKey() && (
              <Button variant="outline" onClick={toggleVisibility}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
