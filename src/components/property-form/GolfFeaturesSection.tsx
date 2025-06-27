

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface GolfFeaturesSectionProps {
  form: UseFormReturn<any>;
}

const GolfFeaturesSection = ({ form }: GolfFeaturesSectionProps) => {
  const partneredWithCourse = form.watch('partneredWithCourse');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-emerald-900 mb-2">Golf-Specific Features</h2>
        <p className="text-emerald-700">Highlight what makes your property special for golfers</p>
      </div>

      <FormField
        control={form.control}
        name="golfBagStorage"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border-emerald-200 border p-4 bg-emerald-50/30">
            <div className="space-y-0.5">
              <FormLabel className="text-base text-emerald-900">Golf Bag Storage Available?</FormLabel>
              <div className="text-[0.8rem] text-emerald-700">
                Do you provide secure storage for golf equipment?
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="partneredWithCourse"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border-emerald-200 border p-4 bg-emerald-50/30">
            <div className="space-y-0.5">
              <FormLabel className="text-base text-emerald-900">Partnered with Local Course?</FormLabel>
              <div className="text-[0.8rem] text-emerald-700">
                Do you have special arrangements with a golf course?
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {partneredWithCourse && (
        <FormField
          control={form.control}
          name="partnerCourseName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-emerald-900">Partner Course Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter the golf course name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="tournamentDiscounts"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border-emerald-200 border p-4 bg-emerald-50/30">
            <div className="space-y-0.5">
              <FormLabel className="text-base text-emerald-900">Offer Tournament-Week Discounts?</FormLabel>
              <div className="text-[0.8rem] text-emerald-700">
                Do you offer special rates during major tournaments?
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="canHostGroups"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border-emerald-200 border p-4 bg-emerald-50/30">
            <div className="space-y-0.5">
              <FormLabel className="text-base text-emerald-900">Can Host Golf Groups?</FormLabel>
              <div className="text-[0.8rem] text-emerald-700">
                Is your property suitable for golf group bookings?
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default GolfFeaturesSection;

