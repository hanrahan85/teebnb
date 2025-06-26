
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface PricingSectionProps {
  form: UseFormReturn<any>;
}

const PricingSection = ({ form }: PricingSectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pricing & Availability</h2>
        <p className="text-gray-600">Set your rates and booking requirements</p>
      </div>

      <FormField
        control={form.control}
        name="nightlyPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nightly Price (EUR) *</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="1"
                step="0.01"
                placeholder="150.00"
                {...field} 
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="cleaningFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cleaning Fee (EUR)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0"
                  step="0.01"
                  placeholder="50.00"
                  {...field} 
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="securityDeposit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Security Deposit (EUR)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0"
                  step="0.01"
                  placeholder="200.00"
                  {...field} 
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="minimumStay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Stay (nights) *</FormLabel>
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
          name="maximumStay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Stay (nights)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1"
                  placeholder="30"
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Coming Soon: Advanced Pricing</h3>
        <p className="text-sm text-blue-700">
          Tournament week pricing and calendar availability features will be available in the next update.
        </p>
      </div>
    </div>
  );
};

export default PricingSection;
