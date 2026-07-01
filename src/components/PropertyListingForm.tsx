
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormSection } from '@/components/ui/form-section';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, ArrowRight, CheckCircle, Eye, MapPin, BedDouble, Users, Star, ExternalLink } from 'lucide-react';

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

type Stage = 'form' | 'review' | 'success';

const PropertyListingForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const editListingId = (location.state as { editListingId?: string } | null)?.editListingId ?? null;
  const isEditMode = Boolean(editListingId);

  const [stage, setStage] = useState<Stage>('form');
  const [publishedListingId, setPublishedListingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSection, setCurrentSection] = useState(1);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [sectionsWithErrors, setSectionsWithErrors] = useState<number[]>([]);
  const [editLoading, setEditLoading] = useState(isEditMode);
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

  // Load saved form data on mount (only when NOT editing an existing listing)
  useEffect(() => {
    if (isEditMode) return; // skip auto-restore when editing
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
  }, [form, isEditMode]);

  // Fetch existing listing data when in edit mode
  useEffect(() => {
    if (!editListingId) return;
    const fetchListing = async () => {
      setEditLoading(true);
      const { data, error } = await supabase
        .from('property_listings')
        .select('*')
        .eq('id', editListingId)
        .single();
      if (error || !data) {
        toast.error('Could not load listing for editing');
        setEditLoading(false);
        return;
      }
      const d = data as Record<string, unknown>;
      form.reset({
        propertyTitle: (d.property_title as string) || '',
        propertyType: (d.property_type as PropertyListingFormData['propertyType']) || 'House',
        maxGuests: (d.max_guests as number) || 1,
        bedrooms: (d.bedrooms as number) || 1,
        beds: (d.beds as number) || 1,
        bathrooms: (d.bathrooms as number) || 1,
        propertyPrivacy: (d.property_privacy as PropertyListingFormData['propertyPrivacy']) || 'Entire Place',
        fullAddress: (d.full_address as string) || '',
        distanceToCourse: (d.distance_to_course as number | undefined) ?? undefined,
        distanceUnit: (d.distance_unit as PropertyListingFormData['distanceUnit']) ?? undefined,
        nearbyGolfCourses: (d.nearby_golf_courses as string[]) || [],
        parkingAvailability: (d.parking_availability as PropertyListingFormData['parkingAvailability']) ?? undefined,
        amenities: (d.amenities as PropertyListingFormData['amenities']) || {
          wifi: false, tv: false, kitchen: false, golfClubStorage: false, washerDryer: false,
          heating: false, ac: false, golfCourseView: false, patioBalcony: false,
          breakfastIncluded: false, shuttleService: false,
        },
        golfBagStorage: Boolean(d.golf_bag_storage),
        partneredWithCourse: Boolean(d.partnered_with_course),
        partnerCourseName: (d.partner_course_name as string | undefined) ?? undefined,
        tournamentDiscounts: Boolean(d.tournament_discounts),
        canHostGroups: Boolean(d.can_host_groups),
        photos: (d.photos as string[]) || [],
        coverImage: (d.cover_image as string) || '',
        nightlyPrice: (d.nightly_price as number) || 0,
        cleaningFee: (d.cleaning_fee as number | undefined) ?? undefined,
        securityDeposit: (d.security_deposit as number | undefined) ?? undefined,
        minimumStay: (d.minimum_stay as number) || 1,
        maximumStay: (d.maximum_stay as number | undefined) ?? undefined,
        instantBooking: Boolean(d.instant_booking),
        cancellationPolicy: (d.cancellation_policy as PropertyListingFormData['cancellationPolicy']) || 'Moderate',
        houseRules: (d.house_rules as string | undefined) ?? undefined,
        checkinTime: (d.checkin_time as string | undefined) ?? undefined,
        checkoutTime: (d.checkout_time as string | undefined) ?? undefined,
        hostName: (d.host_name as string) || '',
        hostBio: (d.host_bio as string | undefined) ?? undefined,
        languagesSpoken: (d.languages_spoken as string[]) || [],
        hostPhone: (d.host_phone as string | undefined) ?? undefined,
      });
      setEditLoading(false);
      toast.success('Listing loaded — make your changes below');
    };
    fetchListing();
  }, [editListingId, form]);

  // Check section completion and errors (only runs when currentSection changes, not on every formState update)
  const updateSectionStatus = async () => {
    const errors = form.formState.errors;
    const withErrors: number[] = [];

    for (let i = 1; i <= totalSections; i++) {
      if (getSectionFields(i).some(field => getNestedError(errors, field))) {
        withErrors.push(i);
      }
    }

    setSectionsWithErrors(withErrors);
  };

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
    const payload = {
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
    };

    try {
      if (isEditMode && editListingId) {
        // UPDATE existing listing
        const { error } = await supabase
          .from('property_listings')
          .update(payload)
          .eq('id', editListingId)
          .eq('user_id', user.id);

        if (error) throw error;
        setPublishedListingId(editListingId);
        setStage('success');
      } else {
        // INSERT new listing
        const { data: insertData, error } = await supabase
          .from('property_listings')
          .insert({ ...payload, user_id: user.id })
          .select();

        if (error) throw error;
        const newId = insertData?.[0]?.id ?? null;
        setPublishedListingId(newId);
        localStorage.removeItem('teebnb-property-form');
        setStage('success');
      }
    } catch (error: any) {
      console.error('Error saving listing:', error);
      if (error.message?.includes('photos')) {
        toast.error('Please upload at least 3 photos before publishing');
      } else if (error.message?.includes('required')) {
        toast.error('Please fill in all required fields');
      } else if (error.code === '23505') {
        toast.error('A listing with this information already exists');
      } else {
        toast.error(`Failed to save listing: ${error.message || 'Please try again'}`);
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
    
    // Mark current section as completed
    setCompletedSections(prev => prev.includes(currentSection) ? prev : [...prev, currentSection]);
    await updateSectionStatus();

    if (currentSection < totalSections) {
      setCurrentSection(currentSection + 1);
      toast.success(`✅ Section ${currentSection} completed!`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // All sections done — go to review
      setStage('review');
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
    setStage('form');
    toast.success('Form cleared');
  };

  // ── EDIT LOADING SCREEN ───────────────────────────────────────
  if (editLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-emerald-700 font-medium">Loading your listing…</p>
      </div>
    );
  }

  // ── SUCCESS SCREEN ────────────────────────────────────────────
  if (stage === 'success') {
    const data = form.getValues();
    return (
      <div className="max-w-2xl mx-auto text-center py-12 space-y-8">
        {/* Big green tick */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle className="w-14 h-14 text-emerald-600" />
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-emerald-900 mb-3">
            {isEditMode ? 'Changes saved! ✅' : 'Your listing is live! 🎉'}
          </h2>
          <p className="text-emerald-700 text-lg">
            <span className="font-semibold">{data.propertyTitle}</span>{' '}
            {isEditMode
              ? 'has been updated successfully.'
              : 'is now published on TeeBnB and visible to golfers worldwide.'}
          </p>
        </div>

        {/* Listing summary card */}
        <div className="bg-white border border-emerald-200 rounded-2xl overflow-hidden shadow-md text-left">
          {data.coverImage && (
            <img src={data.coverImage} alt={data.propertyTitle} className="w-full h-48 object-cover" />
          )}
          <div className="p-6 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-bold text-xl text-emerald-900">{data.propertyTitle}</h3>
              <span className="text-emerald-700 font-semibold whitespace-nowrap">€{data.nightlyPrice} / night</span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-emerald-500" />{data.fullAddress}</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4 text-emerald-500" />Up to {data.maxGuests} guests</span>
              <span className="flex items-center gap-1"><BedDouble className="w-4 h-4 text-emerald-500" />{data.bedrooms} bed · {data.bathrooms} bath</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full">{data.propertyType}</span>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full">{data.propertyPrivacy}</span>
              {data.instantBooking && (
                <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full">⚡ Instant booking</span>
              )}
            </div>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {publishedListingId && (
            <Button
              onClick={() => navigate(`/property/${publishedListingId}`)}
              className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 text-base px-6 py-3"
            >
              <ExternalLink className="w-5 h-5" />
              View your listing
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-base px-6 py-3"
          >
            Go to dashboard
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              form.reset();
              setCurrentSection(1);
              setCompletedSections([]);
              setSectionsWithErrors([]);
              setPublishedListingId(null);
              setStage('form');
            }}
            className="text-gray-500 hover:text-gray-700 text-base px-6 py-3"
          >
            List another property
          </Button>
        </div>
      </div>
    );
  }

  // ── REVIEW SCREEN ─────────────────────────────────────────────
  if (stage === 'review') {
    const data = form.getValues();
    const amenityList = data.amenities
      ? Object.entries(data.amenities).filter(([, v]) => v).map(([k]) =>
          k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
        )
      : [];

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-emerald-900">Review your listing</h2>
            </div>
            <p className="text-emerald-700">Everything look right? Hit Publish when you're ready to go live.</p>
          </div>

          {/* Cover photo */}
          {data.coverImage && (
            <div className="rounded-2xl overflow-hidden">
              <img src={data.coverImage} alt={data.propertyTitle} className="w-full h-64 object-cover" />
              {data.photos.length > 1 && (
                <p className="text-sm text-gray-500 mt-2">{data.photos.length} photos uploaded</p>
              )}
            </div>
          )}

          {/* Key details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Title', value: data.propertyTitle },
              { label: 'Type', value: `${data.propertyType} · ${data.propertyPrivacy}` },
              { label: 'Location', value: data.fullAddress },
              { label: 'Distance to course', value: data.distanceToCourse ? `${data.distanceToCourse} ${data.distanceUnit}` : '—' },
              { label: 'Guests / Beds / Baths', value: `${data.maxGuests} guests · ${data.bedrooms} bed · ${data.bathrooms} bath` },
              { label: 'Nightly price', value: `€${data.nightlyPrice}${data.cleaningFee ? ` + €${data.cleaningFee} cleaning` : ''}` },
              { label: 'Min stay', value: `${data.minimumStay} night${data.minimumStay > 1 ? 's' : ''}` },
              { label: 'Cancellation', value: data.cancellationPolicy },
              { label: 'Instant booking', value: data.instantBooking ? 'Yes' : 'No' },
              { label: 'Host', value: data.hostName },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                <p className="text-gray-800 font-medium">{value}</p>
              </div>
            ))}
          </div>

          {/* Amenities */}
          {amenityList.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {amenityList.map(a => (
                  <span key={a} className="bg-emerald-50 text-emerald-700 text-sm font-medium px-3 py-1 rounded-full">{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Nearby courses */}
          {data.nearbyGolfCourses && data.nearbyGolfCourses.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Nearby golf courses</p>
              <div className="flex flex-wrap gap-2">
                {data.nearbyGolfCourses.map((c: string) => (
                  <span key={c} className="bg-emerald-50 text-emerald-700 text-sm font-medium px-3 py-1 rounded-full">⛳ {c}</span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => { setStage('form'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back and edit
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 min-w-[200px] text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isEditMode ? 'Saving...' : 'Publishing...'}
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  {isEditMode ? 'Save changes' : 'Publish listing'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  // ── FORM (sections 1–8) ────────────────────────────────────────
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
            <Button
              type="button"
              onClick={nextSection}
              className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
            >
              {currentSection === totalSections ? (
                <>
                  <Eye className="h-4 w-4" />
                  Review listing
                </>
              ) : (
                <>
                  Next Section
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
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
