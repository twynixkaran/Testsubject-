import React from 'react';

interface PhoneMockupProps {
  children: React.ReactNode;
}

export function PhoneMockup({ children }: PhoneMockupProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="relative">
        {/* Phone Frame */}
        <div className="w-[375px] h-[812px] bg-black rounded-[3rem] p-2 shadow-2xl">
          {/* Screen */}
          <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-50"></div>
            
            {/* Content */}
            <div className="w-full h-full">
              {children}
            </div>
          </div>
        </div>
        
        {/* Phone Details */}
        <div className="absolute -right-1 top-20 w-1 h-12 bg-gray-800 rounded-r"></div>
        <div className="absolute -right-1 top-36 w-1 h-8 bg-gray-800 rounded-r"></div>
        <div className="absolute -right-1 top-48 w-1 h-8 bg-gray-800 rounded-r"></div>
        <div className="absolute -left-1 top-24 w-1 h-8 bg-gray-800 rounded-l"></div>
      </div>
    </div>
  );
}