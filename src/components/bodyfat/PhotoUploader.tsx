import React, { useRef } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface PhotoUploaderProps {
  type: string;
  label: string;
  required?: boolean;
  file?: File;
  onUpload: (file: File) => void;
}

export function PhotoUploader({ type, label, required, file, onUpload }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <button
        onClick={() => inputRef.current?.click()}
        className={`w-full aspect-[3/4] rounded-xl border-2 border-dashed transition-all ${
          file
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
        }`}
      >
        {file ? (
          <div className="relative w-full h-full">
            <img
              src={URL.createObjectURL(file)}
              alt={`${type} view`}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-full p-2"
              >
                <Check className="h-6 w-6 text-green-600" />
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <div className="text-sm font-medium text-gray-900">{label}</div>
            {required && (
              <div className="text-xs text-indigo-600 mt-1">Required</div>
            )}
          </div>
        )}
      </button>

      {file && (
        <button
          onClick={() => onUpload(undefined as any)}
          className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}