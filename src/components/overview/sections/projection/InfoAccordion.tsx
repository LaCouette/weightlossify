import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

export function InfoAccordion() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-indigo-50 rounded-lg px-4 py-3 flex items-center justify-between text-left transition-colors hover:bg-indigo-100"
      >
        <div className="flex items-center gap-3">
          <Info className="h-5 w-5 text-indigo-600 flex-shrink-0" />
          <span className="font-medium text-gray-900">
            Learn how this feature helps you stay on track
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-indigo-600" />
        ) : (
          <ChevronDown className="h-5 w-5 text-indigo-600" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-2 bg-indigo-50 rounded-lg px-4 py-3 text-sm text-gray-600">
          <ul className="space-y-2 ml-8">
            <li className="list-disc">
              Pre-plan days when you know your calories or steps will differ from usual
            </li>
            <li className="list-disc">
              See automatically adjusted targets for remaining days
            </li>
            <li className="list-disc">
              Stay aligned with your weekly goals even with varying daily schedules
            </li>
            <li className="list-disc">
              Get early warnings if your targets become hard to achieve
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}