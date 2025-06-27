

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface PropertyOverviewSectionProps {
  form: UseFormReturn<any>;
}

const PropertyOverviewSection = ({ form }: PropertyOverviewSectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-emerald-900 mb-2">Property Overview</h2>
        <p className="text-emerald-700">Tell us about your property basics</p>
      </div>

      <FormField
        control={form.control}
        name="propertyTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-emerald-900">Property Title *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Cozy Golf Cottage near St. Andrews" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="propertyType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-emerald-900">Property Type *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="House">House</SelectItem>
                <SelectItem value="Cottage">Cottage</SelectItem>
                <SelectItem value="B&B">B&B</SelectItem>
                <SelectItem value="Hotel Room">Hotel Room</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <FormField
          control={form.control}
          name="maxGuests"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-emerald-900">Max Guests *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1"
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bedrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-emerald-900">Bedrooms *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1"
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="beds"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-emerald-900">Beds *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1"
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bathrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-emerald-900">Bathrooms *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1"
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="propertyPrivacy"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-emerald-900">Property Privacy *</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Entire Place" id="entire" />
                  <Label htmlFor="entire" className="text-emerald-800">Entire Place - Guests have the whole place to themselves</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Private Room" id="private" />
                  <Label htmlFor="private" className="text-emerald-800">Private Room - Guests have a private room in a shared home</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Shared Space" id="shared" />
                  <Label htmlFor="shared" className="text-emerald-800">Shared Space - Guests share the space with others</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PropertyOverviewSection;

