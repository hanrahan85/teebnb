import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface ProgressIndicatorProps {
  currentSection: number;
  totalSections: number;
  completedSections: number[];
  sectionsWithErrors: number[];
  sectionTitles: string[];
}

export const ProgressIndicator = ({ 
  currentSection, 
  totalSections, 
  completedSections, 
  sectionsWithErrors,
  sectionTitles 
}: ProgressIndicatorProps) => {
  const percentage = Math.round((completedSections.length / totalSections) * 100);

  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Section {currentSection} of {totalSections}</span>
        <span>{percentage}% Complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
        <div 
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(completedSections.length / totalSections) * 100}%` }}
        />
      </div>

      {/* Section Indicators */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {Array.from({ length: totalSections }, (_, index) => {
          const sectionNumber = index + 1;
          const isCompleted = completedSections.includes(sectionNumber);
          const hasError = sectionsWithErrors.includes(sectionNumber);
          const isCurrent = sectionNumber === currentSection;

          return (
            <div 
              key={sectionNumber}
              className={cn(
                "flex flex-col items-center p-2 rounded-lg transition-all duration-200",
                isCurrent && "bg-emerald-100 border border-emerald-300",
                hasError && "bg-red-50 border border-red-200",
                isCompleted && !hasError && "bg-emerald-50"
              )}
            >
              <div className="flex items-center justify-center mb-1">
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                ) : hasError ? (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <Circle className={cn(
                    "h-5 w-5",
                    isCurrent ? "text-emerald-600 fill-emerald-100" : "text-gray-400"
                  )} />
                )}
              </div>
              <span className={cn(
                "text-xs font-medium text-center leading-tight",
                isCurrent ? "text-emerald-700" : hasError ? "text-red-600" : "text-gray-600"
              )}>
                {sectionTitles[index]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};