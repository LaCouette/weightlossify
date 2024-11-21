import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

export function PhotoInstructions() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Info className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Photo Guidelines</h3>
            <p className="text-sm text-gray-500">Tips for accurate body fat estimation</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 py-4 border-t border-gray-200 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Required Photos</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Front view: standing straight, arms slightly away from body</li>
              <li>• Back view: same posture as front view</li>
              <li>• Left side profile: arms at sides</li>
              <li>• Right side profile: arms at sides</li>
              <li>• 45-degree angle: showing obliques and overall proportion</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Optional Photos</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Close-up of abdominal area</li>
              <li>• Front and back leg views</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Best Practices</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Wear fitted clothing (swimwear or athletic wear)</li>
              <li>• Use good lighting with minimal shadows</li>
              <li>• Stand against a plain background</li>
              <li>• Keep a neutral posture (no flexing)</li>
              <li>• Take photos from 1.5-2 meters away</li>
            </ul>
          </div>

          <div className="bg-indigo-50 rounded-lg p-4 text-sm text-indigo-600">
            <strong>Privacy Note:</strong> Your photos are processed securely and are not stored permanently. They are only used for body fat estimation and are deleted immediately after analysis.
          </div>
        </div>
      )}
    </div>
  );
}