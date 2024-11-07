import React, { useRef, useState, useEffect } from 'react';
import { Percent } from 'lucide-react';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setStartX(e.pageX - container.offsetLeft);
      setScrollLeft(container.scrollLeft);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    const handleTouchStart = (e: TouchEvent) => {
      setIsDragging(true);
      setStartX(e.touches[0].pageX - container.offsetLeft);
      setScrollLeft(container.scrollLeft);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleMouseUp);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, startX, scrollLeft]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Percent className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <label className="block font-bold text-gray-900">Estimate Your Body Fat</label>
          <p className="text-sm text-gray-600 mt-1">
            Select the image that most closely matches your current physique
          </p>
        </div>
      </div>

      <div
        ref={containerRef}
        className={`flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 pb-4 -mx-2 px-2 cursor-grab active:cursor-grabbing ${
          isDragging ? 'select-none' : ''
        }`}
      >
        {ranges.map(({ range, image, avg }) => (
          <div
            key={range}
            className="flex-none w-[calc(28.57%-12px)] min-w-[200px] snap-start"
          >
            <div
              onClick={() => onChange(avg)}
              className={`relative cursor-pointer group transition-all duration-200 ${
                selectedValue === avg 
                  ? 'ring-4 ring-blue-500 ring-offset-2'
                  : 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-1'
              }`}
            >
              <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={image}
                  alt={`Body fat ${range}`}
                  className="object-cover w-full h-full"
                  loading="lazy"
                  draggable="false"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent ${
                  selectedValue === avg ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                } transition-opacity duration-200`}>
                  <div className="absolute bottom-2 left-2 right-2 text-white text-center">
                    <span className="text-sm font-medium">{range}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <strong>Note:</strong> Body fat percentage is an estimate and may vary based on factors like muscle distribution and body type.
      </div>
    </div>
  );
}