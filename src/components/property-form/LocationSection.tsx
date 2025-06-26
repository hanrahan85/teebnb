
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface LocationSectionProps {
  form: UseFormReturn<any>;
}

const LocationSection = ({ form }: LocationSectionProps) => {
  const [newGolfCourse, setNewGolfCourse] = useState('');
  const nearbyGolfCourses = form.watch('nearbyGolfCourses') || [];

  const addGolfCourse = () => {
    if (newGolfCourse.trim()) {
      const currentCourses = nearbyGolfCourses;
      form.setValue('nearbyGolfCourses', [...currentCourses, newGolfCourse.trim()]);
      setNewGolfCourse('');
    }
  };

  const removeGolfCourse = (index: number) => {
    const currentCourses = nearbyGolfCourses;
    const updated = currentCourses.filter((_: string, i: number) => i !== index);
    form.setValue('nearbyGolfCourses', updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Location</h2>
        <p className="text-gray-600">Help guests find your property and nearby golf courses</p>
      </div>

      <FormField
        control={form.control}
        name="fullAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Address *</FormLabel>
            <FormControl>
              <Input placeholder="123 Golf Course Road, St. Andrews, Scotland" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="distanceToCourse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distance to Nearest Golf Course</FormLabel>
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
              <FormLabel>Distance Unit</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        <FormLabel>Nearby Golf Courses</FormLabel>
        <div className="mt-2 space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Enter golf course name"
              value={newGolfCourse}
              onChange={(e) => setNewGolfCourse(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGolfCourse())}
            />
            <Button type="button" onClick={addGolfCourse} variant="outline">
              Add
            </Button>
          </div>
          
          {nearbyGolfCourses.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {nearbyGolfCourses.map((course: string, index: number) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {course}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
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
            <FormLabel>Parking Availability</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
