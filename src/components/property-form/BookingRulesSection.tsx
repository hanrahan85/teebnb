

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface BookingRulesSectionProps {
  form: UseFormReturn<any>;
}

const BookingRulesSection = ({ form }: BookingRulesSectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-emerald-900 mb-2">Booking & Rules</h2>
        <p className="text-emerald-700">Set your booking policies and house rules</p>
      </div>

      <FormField
        control={form.control}
        name="instantBooking"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border-emerald-200 border p-4 bg-emerald-50/30">
            <div className="space-y-0.5">
              <FormLabel className="text-base text-emerald-900">Instant Booking Enabled?</FormLabel>
              <div className="text-[0.8rem] text-emerald-700">
                Allow guests to book immediately without approval
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
        name="cancellationPolicy"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-emerald-900">Cancellation Policy *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select cancellation policy" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Flexible">Flexible - Full refund 24 hours before check-in</SelectItem>
                <SelectItem value="Moderate">Moderate - Full refund 5 days before check-in</SelectItem>
                <SelectItem value="Strict">Strict - 50% refund up to 1 week before check-in</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="houseRules"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-emerald-900">House Rules</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., No smoking, No parties, Check-in after 4pm, Quiet hours 10pm-8am..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="checkinTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-emerald-900">Check-in Time</FormLabel>
              <FormControl>
                <Input 
                  type="time"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="checkoutTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-emerald-900">Check-out Time</FormLabel>
              <FormControl>
                <Input 
                  type="time"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default BookingRulesSection;

