
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

interface AmenitiesSectionProps {
  form: UseFormReturn<any>;
}

const AmenitiesSection = ({ form }: AmenitiesSectionProps) => {
  const amenities = [
    { key: 'wifi', label: 'WiFi' },
    { key: 'tv', label: 'TV' },
    { key: 'kitchen', label: 'Kitchen' },
    { key: 'golfClubStorage', label: 'Golf club storage' },
    { key: 'washerDryer', label: 'Washer / Dryer' },
    { key: 'heating', label: 'Heating' },
    { key: 'ac', label: 'A/C' },
    { key: 'golfCourseView', label: 'Golf course view' },
    { key: 'patioBalcony', label: 'Patio / Balcony' },
    { key: 'breakfastIncluded', label: 'Breakfast included' },
    { key: 'shuttleService', label: 'Shuttle to/from course' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Amenities</h2>
        <p className="text-gray-600">What amenities does your property offer?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {amenities.map((amenity) => (
          <FormField
            key={amenity.key}
            control={form.control}
            name={`amenities.${amenity.key}`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">
                  {amenity.label}
                </FormLabel>
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default AmenitiesSection;
