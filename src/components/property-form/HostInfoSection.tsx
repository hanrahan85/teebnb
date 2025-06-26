
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface HostInfoSectionProps {
  form: UseFormReturn<any>;
}

const HostInfoSection = ({ form }: HostInfoSectionProps) => {
  const [newLanguage, setNewLanguage] = useState('');
  const languagesSpoken = form.watch('languagesSpoken') || [];

  const commonLanguages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
    'Dutch', 'Russian', 'Japanese', 'Chinese', 'Korean', 'Arabic'
  ];

  const addLanguage = (language: string) => {
    if (language && !languagesSpoken.includes(language)) {
      form.setValue('languagesSpoken', [...languagesSpoken, language]);
      setNewLanguage('');
    }
  };

  const removeLanguage = (index: number) => {
    const updated = languagesSpoken.filter((_: string, i: number) => i !== index);
    form.setValue('languagesSpoken', updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Host Information</h2>
        <p className="text-gray-600">Tell guests about yourself</p>
      </div>

      <FormField
        control={form.control}
        name="hostName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name *</FormLabel>
            <FormControl>
              <Input placeholder="Enter your full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hostBio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Short Bio</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell guests a little about yourself, your experience with golf, or what makes your property special..."
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <FormLabel>Languages Spoken</FormLabel>
        <div className="mt-2 space-y-3">
          <div className="flex flex-wrap gap-2">
            {commonLanguages.map((language) => (
              <Button
                key={language}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addLanguage(language)}
                disabled={languagesSpoken.includes(language)}
              >
                {language}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Enter another language"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage(newLanguage))}
            />
            <Button 
              type="button" 
              onClick={() => addLanguage(newLanguage)} 
              variant="outline"
            >
              Add
            </Button>
          </div>
          
          {languagesSpoken.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {languagesSpoken.map((language: string, index: number) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {language}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => removeLanguage(index)}
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
        name="hostPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input placeholder="+1 (555) 123-4567" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          <strong>Email:</strong> Your email will be automatically included from your account.
        </p>
      </div>
    </div>
  );
};

export default HostInfoSection;
