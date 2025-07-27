import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface FormSectionProps {
  title: string;
  description: string;
  isCompleted?: boolean;
  hasErrors?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormSection = ({ 
  title, 
  description, 
  isCompleted, 
  hasErrors, 
  children, 
  className 
}: FormSectionProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {isCompleted ? (
            <CheckCircle className="h-6 w-6 text-emerald-600" />
          ) : hasErrors ? (
            <AlertCircle className="h-6 w-6 text-red-500" />
          ) : (
            <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
          )}
        </div>
        <div className="flex-1">
          <h2 className={cn(
            "text-2xl font-bold mb-2",
            hasErrors ? "text-red-700" : "text-emerald-900"
          )}>
            {title}
          </h2>
          <p className={cn(
            hasErrors ? "text-red-600" : "text-emerald-700"
          )}>
            {description}
          </p>
        </div>
      </div>
      
      <div className={cn(
        "border rounded-lg p-6 transition-all duration-200",
        hasErrors 
          ? "border-red-200 bg-red-50/50" 
          : isCompleted 
            ? "border-emerald-200 bg-emerald-50/30"
            : "border-gray-200 bg-white"
      )}>
        {children}
      </div>
    </div>
  );
};