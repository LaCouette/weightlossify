import React, { useState } from 'react';
import { Percent, ChevronLeft, ChevronRight } from 'lucide-react';

interface BodyFatSelectorProps {
  gender: string;
  selectedValue: number;
  onChange: (value: number) => void;
}

const maleBodyFatRanges = [
  { range: '1-4%', avg: 2.5, image: 'https://raw.githubusercontent.com/LaCouette/bodyfat-pictures/refs/heads/main/man/1-4.jpg' },
  { range: '5-7%', avg: 6, image: 'https://raw.githubusercontent.com/LaCouette/bodyfat-pictures/refs/heads/main/man/5-7.jpg' },
  { range: '8-10%', avg: 9, image: 'https://raw.githubusercontent.com/LaCouette/bodyfat-pictures/refs/heads/main/man/8-10.jpg' },
  { range: '11-12%', avg: 11.5, image: 'https://raw.githubusercontent.com/LaCouette/bodyfat-pictures/refs/heads/main/man/11-12.jpg' },
  { range: '13-15%', avg: 14, image: 'https://raw.githubusercontent.com/LaCouette/bodyfat-pictures/refs/heads/main/man/13-15.jpg' },
  { range: '16-19%', avg: 17.5, image: 'https://raw.githubusercontent.com/LaCouette/bodyfat-pictures/refs/heads/main/man/16-19.jpg' },
  { range: '20-24%', avg: 22, image: 'https://raw.githubusercontent.com/LaCouette/bodyfat-pictures/refs/heads/main/man/20-24.jpg' },
  { range: '25-30%', avg: 27.5, image: 'https://raw.githubusercontent.com/LaCouette/bodyfat-pictures/refs/heads/main/man/25-30.jpg' },
  { range: '35-40%', avg: 37.5, image: 'https://raw.githubusercontent.com/LaCouette/bodyfat-pictures/refs/heads/main/man/35-40.jpg' }
];

const femaleBodyFatRanges = [
  { range: '12%', avg: 12, image: 'https://raw.githubusercontent.com/LaCouette/bodyfat-pictures/main/woman/12.jpg?raw=true' },
  { range: '15%', avg: 15, image: 'https://raw.githubusercontent.com/LaCouette/bodyfat-pictures/main/woman/15.jpg?raw=true' },
  { range: '20%', avg: 20, image: 'https://raw.githubusercontent.com/LaCouette/bodyfat-pictures/main/woman/20.jpg?raw=true' },
  { range: '25%', avg: 25, image: 'https://raw.githubusercontent.com/LaCouette/bodyfat-pictures/main/woman/25.jpg?raw=true' },
  { range: '30%', avg: 30, image: 'https://raw.githubusercontent.com/LaCouette/bodyfat-pictures/main/woman/30.jpg?raw=true' },
  { range: '35%', avg: 35, image: 'https://raw.githubusercontent.com/LaCouette/bodyfat-pictures/main/woman/35.jpg?raw=true' },
  { range: '40%', avg: 40, image: 'https://raw.githubusercontent.com/LaCouette/bodyfat-pictures/main/woman/40.jpg?raw=true' },
  { range: '45%', avg: 45, image: 'https://raw.githubusercontent.com/LaCouette/bodyfat-pictures/main/woman/45.jpg?raw=true' }
];

export function BodyFatSelector({ gender, selectedValue, onChange }: BodyFatSelectorProps) {
  const ranges = gender === 'female' ? femaleBodyFatRanges : maleBodyFatRanges;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(ranges.length - 1, prev + 1));
  };

  const currentImage = ranges[currentIndex];

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Percent className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <label className="block font-bold text-gray-900">Estimate Your Body Fat</label>
          <p className="text-sm text-gray-600 mt-1">
            Swipe or use arrows to find your match
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="p-2 bg-white/90 rounded-full shadow-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="relative mx-auto max-w-sm">
          <div
            onClick={() => onChange(currentImage.avg)}
            className={`relative transition-all duration-200 ${
              selectedValue === currentImage.avg 
                ? 'ring-4 ring-blue-500 ring-offset-2'
                : 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-1'
            }`}
          >
            <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={currentImage.image}
                alt={`Body fat ${currentImage.range}`}
                className="object-cover w-full h-full"
                loading="lazy"
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-100`}>
                <div className="absolute bottom-4 left-0 right-0 text-white text-center">
                  <span className="text-xl font-bold">{currentImage.range}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gray-200 h-1 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / ranges.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
          <button
            onClick={handleNext}
            disabled={currentIndex === ranges.length - 1}
            className="p-2 bg-white/90 rounded-full shadow-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <strong>Note:</strong> Body fat percentage is an estimate and may vary based on factors like muscle distribution and body type.
      </div>
    </div>
  );
}