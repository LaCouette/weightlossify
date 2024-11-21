import React, { useState } from 'react';
import { Beef, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface MacrosData {
  proteins: number;
  fats: number;
  carbs: number;
  fiber: number;
}

interface MacrosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (macros: MacrosData) => Promise<void>;
  isLoading: boolean;
}

export function MacrosModal({ isOpen, onClose, onSubmit, isLoading }: MacrosModalProps) {
  const [macros, setMacros] = useState<MacrosData>({
    proteins: 0,
    fats: 0,
    carbs: 0,
    fiber: 0
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Ensure all values are at least 0
    const validatedMacros = {
      proteins: Math.max(0, macros.proteins),
      fats: Math.max(0, macros.fats),
      carbs: Math.max(0, macros.carbs),
      fiber: Math.max(0, macros.fiber)
    };
    onSubmit(validatedMacros);
  };

  const isValid = Object.values(macros).some(value => value > 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
        >
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
              <Beef className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                Add Macronutrients
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Enter your macronutrient breakdown in grams.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            {[
              { key: 'proteins', label: 'Protein', max: 500 },
              { key: 'fats', label: 'Fats', max: 300 },
              { key: 'carbs', label: 'Carbs', max: 800 },
              { key: 'fiber', label: 'Fiber', max: 100 }
            ].map(({ key, label, max }) => (
              <div key={key} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={macros[key as keyof MacrosData] || ''}
                    onChange={(e) => setMacros(prev => ({
                      ...prev,
                      [key]: e.target.value ? Number(e.target.value) : 0
                    }))}
                    min="0"
                    max={max}
                    step="1"
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">g</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 sm:flex sm:flex-row-reverse gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isValid || isLoading}
              className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}