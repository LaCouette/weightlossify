import React, { useState } from 'react';
import { Camera, Upload, Scale, Ruler, User, AlertTriangle } from 'lucide-react';
import { MetadataForm } from './MetadataForm';
import { PhotoUploader } from './PhotoUploader';
import { PhotoInstructions } from './PhotoInstructions';
import { ScanResults } from './ScanResults';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { useLogsStore } from '../../stores/logsStore';
import { analyzeScan } from './utils/scanAnalysis';

interface ScanMetadata {
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female';
}

interface PhotoData {
  front?: File;
  back?: File;
  leftSide?: File;
  rightSide?: File;
  angle45?: File;
  abdominal?: File;
  legs?: File;
}

interface BodyFatRange {
  min: number;
  max: number;
}

export function BodyFatScan() {
  const { user } = useAuthStore();
  const { profile } = useUserStore();
  const { logs, addLog, updateLog } = useLogsStore();
  
  const [metadata, setMetadata] = useState<ScanMetadata>({
    height: profile?.height || 0,
    weight: profile?.currentWeight || 0,
    age: profile?.age || 0,
    gender: profile?.gender as 'male' | 'female' || 'male'
  });
  
  const [photos, setPhotos] = useState<PhotoData>({});
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<BodyFatRange | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoUpload = (type: keyof PhotoData, file: File) => {
    setPhotos(prev => ({ ...prev, [type]: file }));
  };

  const resetScan = () => {
    setPhotos({});
    setResults(null);
    setError(null);
    setIsScanning(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScan = async () => {
    // Validate required photos
    const requiredPhotos: (keyof PhotoData)[] = ['front', 'back', 'leftSide', 'rightSide', 'angle45'];
    const missingPhotos = requiredPhotos.filter(type => !photos[type]);
    
    if (missingPhotos.length > 0) {
      setError(`Missing required photos: ${missingPhotos.join(', ')}`);
      return;
    }

    setIsScanning(true);
    setError(null);

    try {
      const result = await analyzeScan(photos, metadata);
      setResults(result);

      // Save the average of the range to logs if user is logged in
      if (user?.uid) {
        const avgBodyFat = (result.min + result.max) / 2;
        const todayLog = logs.find(log => {
          const logDate = new Date(log.date);
          const today = new Date();
          return logDate.toDateString() === today.toDateString();
        });

        if (todayLog) {
          await updateLog(user.uid, todayLog.id, {
            ...todayLog,
            bodyFat: avgBodyFat,
            updatedAt: new Date()
          });
        } else {
          await addLog(user.uid, {
            date: new Date().toISOString(),
            bodyFat: avgBodyFat,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    } catch (err) {
      setError('Failed to analyze photos. Please try again.');
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const requiredPhotoCount = Object.values(photos).filter(Boolean).length;
  const totalRequiredPhotos = 5;
  const progress = (requiredPhotoCount / totalRequiredPhotos) * 100;

  if (results !== null) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-center mb-8">
          <button
            onClick={resetScan}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Start New Analysis
          </button>
        </div>

        <ScanResults
          bodyFat={results}
          metadata={metadata}
          onClose={resetScan}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl shadow-md">
          <Camera className="h-8 w-8 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Body Fat Scanner
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get an estimated body fat range using AI analysis of standardized photos. 
          Note: This tool provides ~90% accuracy compared to DEXA scans and should be used for tracking progress, not medical decisions.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-indigo-600" />
            <span className="font-medium text-gray-900">Upload Progress</span>
          </div>
          <span className="text-sm text-gray-600">
            {requiredPhotoCount} of {totalRequiredPhotos} required photos
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Metadata Form */}
      <MetadataForm
        metadata={metadata}
        onChange={setMetadata}
      />

      {/* Photo Instructions */}
      <PhotoInstructions />

      {/* Photo Upload Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <PhotoUploader
          type="front"
          label="Front View"
          required
          file={photos.front}
          onUpload={(file) => handlePhotoUpload('front', file)}
        />
        <PhotoUploader
          type="back"
          label="Back View"
          required
          file={photos.back}
          onUpload={(file) => handlePhotoUpload('back', file)}
        />
        <PhotoUploader
          type="leftSide"
          label="Left Side"
          required
          file={photos.leftSide}
          onUpload={(file) => handlePhotoUpload('leftSide', file)}
        />
        <PhotoUploader
          type="rightSide"
          label="Right Side"
          required
          file={photos.rightSide}
          onUpload={(file) => handlePhotoUpload('rightSide', file)}
        />
        <PhotoUploader
          type="angle45"
          label="45° Angle"
          required
          file={photos.angle45}
          onUpload={(file) => handlePhotoUpload('angle45', file)}
        />
        <PhotoUploader
          type="abdominal"
          label="Abdominal (Optional)"
          file={photos.abdominal}
          onUpload={(file) => handlePhotoUpload('abdominal', file)}
        />
        <PhotoUploader
          type="legs"
          label="Legs (Optional)"
          file={photos.legs}
          onUpload={(file) => handlePhotoUpload('legs', file)}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-900">Error</h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Scan Button */}
      <div className="flex justify-center">
        <button
          onClick={handleScan}
          disabled={isScanning || requiredPhotoCount < totalRequiredPhotos}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isScanning ? 'Analyzing...' : 'Start Analysis'}
        </button>
      </div>
    </div>
  );
}