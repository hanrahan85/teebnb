
import React, { useState, useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, MapPin, Loader2 } from 'lucide-react';

interface LocationSectionProps {
  form: UseFormReturn<any>;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  address: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    town?: string;
    county?: string;
    country?: string;
    postcode?: string;
  };
}

const LocationSection = ({ form }: LocationSectionProps) => {
  const [newGolfCourse, setNewGolfCourse] = useState('');
  const nearbyGolfCourses = form.watch('nearbyGolfCourses') || [];

  // Address autocomplete state
  const [addressInput, setAddressInput] = useState(form.getValues('fullAddress') || '');
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Keep local input in sync when form resets (e.g. edit mode pre-population)
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'fullAddress' && value.fullAddress !== undefined) {
        setAddressInput(value.fullAddress as string);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAddressChange = (value: string) => {
    setAddressInput(value);
    form.setValue('fullAddress', value, { shouldValidate: true });
    setShowSuggestions(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 4) { setSuggestions([]); return; }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=6&addressdetails=1`,
          { headers: { 'Accept-Language': 'en', 'User-Agent': 'TeeBnB/1.0' } }
        );
        const data: NominatimResult[] = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 450); // debounce 450ms to respect Nominatim rate limit
  };

  const handleSelectSuggestion = (result: NominatimResult) => {
    const formatted = result.display_name;
    setAddressInput(formatted);
    form.setValue('fullAddress', formatted, { shouldValidate: true });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const addGolfCourse = () => {
    if (newGolfCourse.trim()) {
      form.setValue('nearbyGolfCourses', [...nearbyGolfCourses, newGolfCourse.trim()]);
      setNewGolfCourse('');
    }
  };

  const removeGolfCourse = (index: number) => {
    form.setValue('nearbyGolfCourses', nearbyGolfCourses.filter((_: string, i: number) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-emerald-900 mb-2">Location</h2>
        <p className="text-emerald-700">Help guests find your property and nearby golf courses</p>
      </div>

      {/* Address with autocomplete */}
      <FormField
        control={form.control}
        name="fullAddress"
        render={({ fieldState }) => (
          <FormItem>
            <FormLabel className="text-emerald-900">Full Address *</FormLabel>
            <FormControl>
              <div ref={wrapperRef} className="relative">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500 pointer-events-none" />
                  <input
                    value={addressInput}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    onFocus={() => addressInput.length >= 4 && setShowSuggestions(true)}
                    placeholder="Start typing your address…"
                    autoComplete="off"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500 animate-spin" />
                  )}
                </div>

                {/* Suggestions dropdown */}
                {showSuggestions && (suggestions.length > 0) && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-xl overflow-hidden">
                    {suggestions.map((result) => (
                      <button
                        key={result.place_id}
                        type="button"
                        onMouseDown={() => handleSelectSuggestion(result)}
                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-emerald-50 transition-colors text-left border-b border-neutral-100 last:border-0"
                      >
                        <MapPin className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700 leading-snug">{result.display_name}</span>
                      </button>
                    ))}
                    <p className="px-4 py-2 text-xs text-neutral-400 bg-neutral-50">
                      Powered by OpenStreetMap
                    </p>
                  </div>
                )}
              </div>
            </FormControl>
            {fieldState.error && (
              <p className="text-sm font-medium text-destructive">{fieldState.error.message}</p>
            )}
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="distanceToCourse"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-emerald-900">Distance to Nearest Golf Course</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g., 5"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="distanceUnit"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-emerald-900">Distance Unit</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="mins">Minutes (walking)</SelectItem>
                  <SelectItem value="metres">Metres</SelectItem>
                  <SelectItem value="miles">Miles</SelectItem>
                  <SelectItem value="km">Kilometres</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <FormLabel className="text-emerald-900">Nearby Golf Courses</FormLabel>
        <div className="mt-2 space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Enter golf course name"
              value={newGolfCourse}
              onChange={(e) => setNewGolfCourse(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGolfCourse())}
            />
            <Button
              type="button"
              onClick={addGolfCourse}
              variant="outline"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              Add
            </Button>
          </div>

          {nearbyGolfCourses.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {nearbyGolfCourses.map((course: string, index: number) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-emerald-100 text-emerald-800">
                  {course}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 text-emerald-600 hover:text-emerald-800"
                    onClick={() => removeGolfCourse(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <FormField
        control={form.control}
        name="parkingAvailability"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-emerald-900">Parking Availability</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select parking option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="On-Site">On-Site</SelectItem>
                <SelectItem value="Street">Street Parking</SelectItem>
                <SelectItem value="Paid Nearby">Paid Nearby</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default LocationSection;
