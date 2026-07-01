
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import PropertyListingForm from '@/components/PropertyListingForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, CheckCircle } from 'lucide-react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const ListProperty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isEditMode = Boolean((location.state as { editListingId?: string } | null)?.editListingId);

  useEffect(() => {
    if (searchParams.get('welcome') === 'true') {
      toast.success("Welcome to TeeBnB! Your email has been verified. Let's get your property listed!", {
        duration: 5000,
      });
    }
  }, [searchParams]);

  return (
    <AuthGuard requireEmailVerification={false}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(isEditMode ? '/dashboard' : '/')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {isEditMode ? 'Back to Dashboard' : 'Back to TeeBnB'}
                </Button>
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-emerald-600" />
                  <h1 className="text-xl font-semibold">{isEditMode ? 'Edit Your Listing' : 'List Your Property'}</h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {searchParams.get('welcome') === 'true' && (
                  <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm text-emerald-700 font-medium">Email Verified!</span>
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  Welcome, {user?.user_metadata?.full_name || user?.email}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {searchParams.get('welcome') === 'true' && (
            <Card className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-emerald-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                    🎉 Welcome to the TeeBnB Host Community!
                  </h3>
                  <p className="text-emerald-700 mb-3">
                    Your email has been verified and you're all set to start hosting golf travelers. Complete the form below to list your property and start earning from golf tourism.
                  </p>
                  <div className="text-sm text-emerald-600">
                    <strong>Next steps:</strong> Fill out your property details, upload photos, and set your pricing to go live!
                  </div>
                </div>
              </div>
            </Card>
          )}

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {isEditMode ? 'Edit Your Listing' : 'Share Your Golf-Friendly Property'}
            </h2>
            <p className="text-lg text-gray-600">
              {isEditMode
                ? 'Update your property details below. Changes will go live as soon as you save.'
                : 'List your property near golf courses and connect with golf travelers from around the world.'}
            </p>
          </div>

          <Card className="p-8">
            <PropertyListingForm />
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
};

export default ListProperty;
