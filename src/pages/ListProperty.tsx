
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import PropertyListingForm from '@/components/PropertyListingForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ListProperty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to TeeBnB
                </Button>
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-emerald-600" />
                  <h1 className="text-xl font-semibold">List Your Property</h1>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Welcome, {user?.user_metadata?.full_name || user?.email}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Share Your Golf-Friendly Property
            </h2>
            <p className="text-lg text-gray-600">
              List your property near golf courses and connect with golf travelers from around the world.
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
