
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
  const totalSections = 8;

  const form = useForm<PropertyListingFormData>({
    resolver: zodResolver(propertyListingSchema),
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
    },
  });

  const onSubmit = async (data: PropertyListingFormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
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
        });

      if (error) throw error;

      toast.success('Property listed successfully!');
      form.reset();
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextSection = () => {
    if (currentSection < totalSections) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 1:
        return <PropertyOverviewSection form={form} />;
      case 2:
        return <LocationSection form={form} />;
      case 3:
        return <AmenitiesSection form={form} />;
      case 4:
        return <GolfFeaturesSection form={form} />;
      case 5:
        return <PhotosSection form={form} />;
      case 6:
        return <PricingSection form={form} />;
      case 7:
        return <BookingRulesSection form={form} />;
      case 8:
        return <HostInfoSection form={form} />;
      default:
        return <PropertyOverviewSection form={form} />;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Section {currentSection} of {totalSections}</span>
            <span>{Math.round((currentSection / totalSections) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentSection / totalSections) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Section */}
        {renderCurrentSection()}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-8 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={prevSection}
            disabled={currentSection === 1}
          >
            Previous
          </Button>
          
          {currentSection < totalSections ? (
            <Button
              type="button"
              onClick={nextSection}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Next Section
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Publish Listing
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default PropertyListingForm;
