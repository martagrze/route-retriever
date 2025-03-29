
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MapPin, Check } from "lucide-react";
import { getPlacesAutocomplete, getApiKey } from "@/utils/googleMapsAPI";
import { cn } from "@/lib/utils";

interface AddressInputAutocompleteProps {
  id: string;
  label: string;
  iconColor?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const AddressInputAutocomplete = ({
  id,
  label,
  iconColor = "text-blue-500",
  placeholder,
  value,
  onChange
}: AddressInputAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<{value: string, label: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Update local input value when the parent component updates the value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Fetch suggestions when input changes
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (inputValue.trim().length >= 2 && getApiKey()) {
      setLoading(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const results = await getPlacesAutocomplete(inputValue);
          
          const formattedSuggestions = results.predictions.map(prediction => ({
            value: prediction.description,
            label: prediction.description
          }));
          
          setSuggestions(formattedSuggestions);
        } catch (error) {
          console.error('Error getting address suggestions:', error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setOpen(true);
    
    // Only update the parent if user clears the input completely
    if (newValue === '') {
      onChange('');
    }
  };

  const handleSelectSuggestion = (selectedValue: string) => {
    setInputValue(selectedValue);
    onChange(selectedValue);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        <span className="flex items-center gap-1">
          <MapPin size={16} className={iconColor} />
          {label}
        </span>
      </Label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="w-full relative">
            <Input
              id={id}
              placeholder={placeholder}
              value={inputValue}
              onChange={handleInputChange}
              className="w-full"
              onClick={() => setOpen(true)}
            />
          </div>
        </PopoverTrigger>
        
        <PopoverContent className="w-full p-0" align="start">
          <Command className="rounded-lg border shadow-md">
            <CommandInput 
              placeholder="Search for an address..."
              value={inputValue} 
              onValueChange={(value) => {
                setInputValue(value);
              }}
              className="h-9"
            />
            
            <CommandList>
              {loading && (
                <CommandEmpty className="py-6 text-center text-sm">
                  Loading suggestions...
                </CommandEmpty>
              )}
              
              {!loading && suggestions.length === 0 && (
                <CommandEmpty className="py-6 text-center text-sm">
                  {inputValue.length < 2 ? 
                    "Type at least 2 characters to search..." : 
                    "No addresses found"}
                </CommandEmpty>
              )}
              
              {suggestions.length > 0 && (
                <CommandGroup heading="Suggestions">
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion.value}
                      value={suggestion.value}
                      onSelect={() => handleSelectSuggestion(suggestion.value)}
                      className="flex items-center gap-2 py-2"
                    >
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{suggestion.label}</span>
                      {suggestion.value === value && (
                        <Check className="h-4 w-4 ml-auto text-green-500" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AddressInputAutocomplete;
