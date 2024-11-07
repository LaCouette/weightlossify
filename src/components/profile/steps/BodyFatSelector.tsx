import React, { useState, useRef, useEffect } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (index: number) => {
    if (!isDragging) {
      setCurrentIndex(index);
      onChange(ranges[index].avg);
    }
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setStartX(
      'touches' in e 
        ? e.touches[0].clientX 
        : (e as React.MouseEvent).clientX
    );
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = 'touches' in e 
      ? e.touches[0].clientX 
      : (e as React.MouseEvent).clientX;
    const diff = currentX - startX;
    setDragOffset(diff);

    // Prevent page scrolling during drag
    e.preventDefault();
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    const threshold = 50; // Swipe threshold to change image
    
    if (dragOffset > threshold && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      onChange(ranges[currentIndex - 1].avg);
    } else if (dragOffset < -threshold && currentIndex < ranges.length - 1) {
      setCurrentIndex(prev => prev + 1);
      onChange(ranges[currentIndex + 1].avg);
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      handleDragStart(e as unknown as React.TouchEvent);
    };

    const handleTouchMove = (e: TouchEvent) => {
      handleDragMove(e as unknown as React.TouchEvent);
    };

    const handleTouchEnd = () => {
      handleDragEnd();
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, startX, currentIndex]);

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Percent className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <label className="block font-bold text-gray-900">Estimate Your Body Fat</label>
          <p className="text-sm text-gray-600 mt-1">
            Swipe or click images to select your match
          </p>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative h-[400px] select-none perspective-[1000px] cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {ranges.map((item, index) => {
            const offset = index - currentIndex;
            const absOffset = Math.abs(offset);
            const isActive = index === currentIndex;
            
            // Calculate drag influence
            const dragInfluence = isDragging ? dragOffset * 0.5 : 0;
            
            let transform = '';
            let zIndex = 0;
            let opacity = 1;

            if (offset < 0) {
              transform = `
                translateX(${-150 - (absOffset - 1) * 50 + dragInfluence}px)
                translateZ(${-100 * absOffset}px)
                rotateY(45deg)
              `;
              zIndex = 10 - absOffset;
              opacity = 1 - absOffset * 0.2;
            } else if (offset > 0) {
              transform = `
                translateX(${150 + (absOffset - 1) * 50 + dragInfluence}px)
                translateZ(${-100 * absOffset}px)
                rotateY(-45deg)
              `;
              zIndex = 10 - absOffset;
              opacity = 1 - absOffset * 0.2;
            } else {
              transform = `
                translateX(${dragInfluence}px)
                translateZ(100px)
              `;
              zIndex = 20;
            }

            // Only render visible images for performance
            if (absOffset > 3) return null;

            return (
              <div
                key={item.range}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(index);
                }}
                className="absolute transition-all duration-300 ease-out"
                style={{
                  transform,
                  zIndex,
                  opacity: opacity > 0 ? opacity : 0,
                }}
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={`Body fat ${item.range}`}
                    className={`w-[250px] h-[350px] object-cover rounded-lg shadow-xl
                      ${isActive ? 'ring-4 ring-blue-500' : ''}
                      ${selectedValue === item.avg ? 'ring-4 ring-green-500' : ''}`}
                    draggable="false"
                  />
                  <div className={`absolute inset-0 rounded-lg transition-all ${
                    isActive ? 'bg-black/0' : 'bg-black/20'
                  }`} />
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <span className="bg-black/60 text-white px-4 py-2 rounded-full text-lg font-bold">
                      {item.range}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <div className="bg-gray-200 h-1 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / ranges.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <strong>Note:</strong> Body fat percentage is an estimate and may vary based on factors like muscle distribution and body type.
      </div>
    </div>
  );
}