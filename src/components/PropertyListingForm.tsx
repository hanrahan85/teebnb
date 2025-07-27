
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormSection } from '@/components/ui/form-section';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

import PropertyOverviewSection from './property-form/PropertyOverviewSection';
import LocationSection from './property-form/LocationSection';
import AmenitiesSection from './property-form/AmenitiesSection';
import GolfFeaturesSection from './property-form/GolfFeaturesSection';
import PhotosSection from './property-form/PhotosSection';
import PricingSection from './property-form/PricingSection';
import BookingRulesSection from './property-form/BookingRulesSection';
import HostInfoSection from './property-form/HostInfoSection';

const propertyListingSchema = z.object({
  // Section 1: Property Overview
  propertyTitle: z.string().min(1, 'Property title is required'),
  propertyType: z.enum(['Apartment', 'House', 'Cottage', 'B&B', 'Hotel Room', 'Other']),
  maxGuests: z.number().min(1, 'Must accommodate at least 1 guest'),
  bedrooms: z.number().min(1, 'Must have at least 1 bedroom'),
  beds: z.number().min(1, 'Must have at least 1 bed'),
  bathrooms: z.number().min(1, 'Must have at least 1 bathroom'),
  propertyPrivacy: z.enum(['Entire Place', 'Private Room', 'Shared Space']),
  
  // Section 2: Location
  fullAddress: z.string().min(1, 'Address is required'),
  distanceToCourse: z.number().optional(),
  distanceUnit: z.enum(['mins', 'metres', 'miles', 'km']).optional(),
  nearbyGolfCourses: z.array(z.string()).optional(),
  parkingAvailability: z.enum(['None', 'On-Site', 'Street', 'Paid Nearby']).optional(),
  
  // Section 3: Amenities
  amenities: z.object({
    wifi: z.boolean().default(false),
    tv: z.boolean().default(false),
    kitchen: z.boolean().default(false),
    golfClubStorage: z.boolean().default(false),
    washerDryer: z.boolean().default(false),
    heating: z.boolean().default(false),
    ac: z.boolean().default(false),
    golfCourseView: z.boolean().default(false),
    patioBalcony: z.boolean().default(false),
    breakfastIncluded: z.boolean().default(false),
    shuttleService: z.boolean().default(false),
  }),
  
  // Section 4: Golf Features
  golfBagStorage: z.boolean().default(false),
  partneredWithCourse: z.boolean().default(false),
  partnerCourseName: z.string().optional(),
  tournamentDiscounts: z.boolean().default(false),
  canHostGroups: z.boolean().default(false),
  
  // Section 5: Photos
  photos: z.array(z.string()).min(3, 'At least 3 photos required'),
  coverImage: z.string().min(1, 'Cover image is required'),
  
  // Section 6: Pricing
  nightlyPrice: z.number().min(1, 'Nightly price is required'),
  cleaningFee: z.number().optional(),
  securityDeposit: z.number().optional(),
  minimumStay: z.number().min(1, 'Minimum stay must be at least 1 night'),
  maximumStay: z.number().optional(),
  
  // Section 7: Booking Rules
  instantBooking: z.boolean().default(false),
  cancellationPolicy: z.enum(['Flexible', 'Moderate', 'Strict']),
  houseRules: z.string().optional(),
  checkinTime: z.string().optional(),
  checkoutTime: z.string().optional(),
  
  // Section 8: Host Info
  hostName: z.string().min(1, 'Host name is required'),
  hostBio: z.string().optional(),
  languagesSpoken: z.array(z.string()).optional(),
  hostPhone: z.string().optional(),
});

type PropertyListingFormData = z.infer<typeof propertyListingSchema>;

const PropertyListingForm = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSection, setCurrentSection] = useState(1);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [sectionsWithErrors, setSectionsWithErrors] = useState<number[]>([]);
  const totalSections = 8;

  const sectionTitles = [
    'Overview', 'Location', 'Amenities', 'Golf Features', 
    'Photos', 'Pricing', 'Rules', 'Host Info'
  ];

  const form = useForm<PropertyListingFormData>({
    resolver: zodResolver(propertyListingSchema),
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      amenities: {
        wifi: false,
        tv: false,
        kitchen: false,
        golfClubStorage: false,
        washerDryer: false,
        heating: false,
        ac: false,
        golfCourseView: false,
        patioBalcony: false,
        breakfastIncluded: false,
        shuttleService: false,
      },
      golfBagStorage: false,
      partneredWithCourse: false,
      tournamentDiscounts: false,
      canHostGroups: false,
      instantBooking: false,
      minimumStay: 1,
      hostName: user?.user_metadata?.full_name || '',
      photos: [],
      nearbyGolfCourses: [],
      languagesSpoken: [],
    },
  });

  // Auto-save form data to localStorage
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (Object.keys(value).length > 0) {
        localStorage.setItem('teebnb-property-form', JSON.stringify(value));
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Load saved form data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('teebnb-property-form');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        form.reset(parsedData);
        toast.info('Previous form data restored');
      } catch (error) {
        console.error('Failed to restore form data:', error);
      }
    }
  }, [form]);

  // Check section completion and errors
  useEffect(() => {
    const checkSectionStatus = async () => {
      const completed: number[] = [];
      const withErrors: number[] = [];

      for (let i = 1; i <= totalSections; i++) {
        const isValid = await validateSection(i);
        if (isValid) {
          completed.push(i);
        } else {
          const errors = form.formState.errors;
          if (getSectionFields(i).some(field => getNestedError(errors, field))) {
            withErrors.push(i);
          }
        }
      }

      setCompletedSections(completed);
      setSectionsWithErrors(withErrors);
    };

    checkSectionStatus();
  }, [form.formState, form.watch()]);

  const getNestedError = (errors: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], errors);
  };

  const getSectionFields = (section: number): string[] => {
    switch (section) {
      case 1: return ['propertyTitle', 'propertyType', 'maxGuests', 'bedrooms', 'beds', 'bathrooms', 'propertyPrivacy'];
      case 2: return ['fullAddress'];
      case 3: return []; // Amenities are optional
      case 4: return []; // Golf features are optional
      case 5: return ['photos', 'coverImage'];
      case 6: return ['nightlyPrice', 'minimumStay'];
      case 7: return ['cancellationPolicy'];
      case 8: return ['hostName'];
      default: return [];
    }
  };

  const validateSection = async (section: number): Promise<boolean> => {
    const fields = getSectionFields(section);
    if (fields.length === 0) return true; // No required fields
    
    try {
      const isValid = await form.trigger(fields as any);
      return isValid;
    } catch {
      return false;
    }
  };

  const onSubmit = async (data: PropertyListingFormData) => {
    if (!user) {
      toast.error('You must be logged in to create a listing');
      return;
    }
    
    // Validate current section before proceeding
    const errors = form.formState.errors;
    const hasErrors = Object.keys(errors).length > 0;
    
    if (hasErrors) {
      // Get first error message
      const firstError = Object.values(errors)[0];
      const errorMessage = firstError?.message || 'Please fix the errors above';
      toast.error(errorMessage);
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Submitting form data:', data);
      
      const { data: insertData, error } = await supabase
        .from('property_listings')
        .insert({
          user_id: user.id,
          property_title: data.propertyTitle,
          property_type: data.propertyType,
          max_guests: data.maxGuests,
          bedrooms: data.bedrooms,
          beds: data.beds,
          bathrooms: data.bathrooms,
          property_privacy: data.propertyPrivacy,
          full_address: data.fullAddress,
          distance_to_course: data.distanceToCourse,
          distance_unit: data.distanceUnit,
          nearby_golf_courses: data.nearbyGolfCourses || [],
          parking_availability: data.parkingAvailability,
          amenities: data.amenities,
          golf_bag_storage: data.golfBagStorage,
          partnered_with_course: data.partneredWithCourse,
          partner_course_name: data.partnerCourseName,
          tournament_discounts: data.tournamentDiscounts,
          can_host_groups: data.canHostGroups,
          photos: data.photos,
          cover_image: data.coverImage,
          nightly_price: data.nightlyPrice,
          cleaning_fee: data.cleaningFee,
          security_deposit: data.securityDeposit,
          minimum_stay: data.minimumStay,
          maximum_stay: data.maximumStay,
          instant_booking: data.instantBooking,
          cancellation_policy: data.cancellationPolicy,
          house_rules: data.houseRules,
          checkin_time: data.checkinTime,
          checkout_time: data.checkoutTime,
          host_name: data.hostName,
          host_bio: data.hostBio,
          languages_spoken: data.languagesSpoken || [],
          host_phone: data.hostPhone,
          host_email: user.email,
          status: 'active',
        })
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Successfully created listing:', insertData);
      toast.success('🎉 Property listed successfully! Your listing is now live.');
      form.reset();
      setCurrentSection(1);
    } catch (error: any) {
      console.error('Error creating listing:', error);
      
      // Provide specific error messages
      if (error.message?.includes('photos')) {
        toast.error('Please upload at least 3 photos before publishing');
      } else if (error.message?.includes('required')) {
        toast.error('Please fill in all required fields');
      } else if (error.code === '23505') {
        toast.error('A listing with this information already exists');
      } else {
        toast.error(`Failed to create listing: ${error.message || 'Please try again'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextSection = async () => {
    // Validate current section before moving forward
    const isValid = await validateSection(currentSection);
    
    if (!isValid) {
      const errors = form.formState.errors;
      const firstError = Object.values(errors)[0];
      const errorMessage = firstError?.message || 'Please complete all required fields in this section';
      toast.error(errorMessage);
      
      // Scroll to first error field
      setTimeout(() => {
        const errorElement = document.querySelector('[aria-invalid="true"]');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }
    
    if (currentSection < totalSections) {
      setCurrentSection(currentSection + 1);
      toast.success(`✅ Section ${currentSection} completed!`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderCurrentSection = () => {
    const sectionProps = {
      isCompleted: completedSections.includes(currentSection),
      hasErrors: sectionsWithErrors.includes(currentSection)
    };

    switch (currentSection) {
      case 1:
        return (
          <FormSection 
            title="Property Overview" 
            description="Tell us about your property basics"
            {...sectionProps}
          >
            <PropertyOverviewSection form={form} />
          </FormSection>
        );
      case 2:
        return (
          <FormSection 
            title="Location" 
            description="Help guests find your property and nearby golf courses"
            {...sectionProps}
          >
            <LocationSection form={form} />
          </FormSection>
        );
      case 3:
        return (
          <FormSection 
            title="Amenities" 
            description="What amenities does your property offer?"
            {...sectionProps}
          >
            <AmenitiesSection form={form} />
          </FormSection>
        );
      case 4:
        return (
          <FormSection 
            title="Golf-Specific Features" 
            description="Highlight what makes your property special for golfers"
            {...sectionProps}
          >
            <GolfFeaturesSection form={form} />
          </FormSection>
        );
      case 5:
        return (
          <FormSection 
            title="Photos" 
            description="Upload at least 3 high-quality photos of your property"
            {...sectionProps}
          >
            <PhotosSection form={form} />
          </FormSection>
        );
      case 6:
        return (
          <FormSection 
            title="Pricing & Availability" 
            description="Set your rates and booking requirements"
            {...sectionProps}
          >
            <PricingSection form={form} />
          </FormSection>
        );
      case 7:
        return (
          <FormSection 
            title="Booking & Rules" 
            description="Set your booking policies and house rules"
            {...sectionProps}
          >
            <BookingRulesSection form={form} />
          </FormSection>
        );
      case 8:
        return (
          <FormSection 
            title="Host Information" 
            description="Tell guests about yourself"
            {...sectionProps}
          >
            <HostInfoSection form={form} />
          </FormSection>
        );
      default:
        return (
          <FormSection 
            title="Property Overview" 
            description="Tell us about your property basics"
            {...sectionProps}
          >
            <PropertyOverviewSection form={form} />
          </FormSection>
        );
    }
  };

  const clearFormData = () => {
    localStorage.removeItem('teebnb-property-form');
    form.reset();
    setCurrentSection(1);
    setCompletedSections([]);
    setSectionsWithErrors([]);
    toast.success('Form cleared');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Enhanced Progress Indicator */}
        <ProgressIndicator
          currentSection={currentSection}
          totalSections={totalSections}
          completedSections={completedSections}
          sectionsWithErrors={sectionsWithErrors}
          sectionTitles={sectionTitles}
        />

        {/* Current Section */}
        {renderCurrentSection()}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-gray-200">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={prevSection}
              disabled={currentSection === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              onClick={clearFormData}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear Form
            </Button>
          </div>
          
          <div className="flex gap-2">
            {currentSection < totalSections ? (
              <Button
                type="button"
                onClick={nextSection}
                className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
              >
                Next Section
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || sectionsWithErrors.length > 0}
                className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 min-w-[200px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Publish Listing
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Form Status Summary */}
        {sectionsWithErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-medium text-red-900 mb-2">
              Please fix the following issues before publishing:
            </h3>
            <ul className="text-sm text-red-700 space-y-1">
              {sectionsWithErrors.map(section => (
                <li key={section}>
                  • Section {section} ({sectionTitles[section - 1]}) has missing required fields
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </Form>
  );
};

export default PropertyListingForm;
