import React, { useState } from 'react';
import { FormData } from '../../../types/profile';
import { Target, Scale, Dumbbell } from 'lucide-react';
import { BodyFatSelector } from './BodyFatSelector';

interface Step3Props {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function Step3({ formData, onChange }: Step3Props) {
  const [targetWeightDisplay, setTargetWeightDisplay] = useState(
    formData.targetWeight?.toString() || formData.currentWeight?.toString() || '70.0'
  );

  const handleBodyFatSelect = (value: number) => {
    onChange({
      target: {
        name: 'bodyFat',
        value: value.toString()
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleWeightChange = (value: string) => {
    // Convert to number and round to nearest 0.5
    const numValue = Math.round(parseFloat(value) * 2) / 2;
    // Format to always show one decimal place
    const formattedValue = numValue.toFixed(1);
    setTargetWeightDisplay(formattedValue);
    onChange({
      target: {
        name: 'targetWeight',
        value: formattedValue
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Set Your Goals</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Let's define what you want to achieve. Your goals help us create a personalized plan that's both effective and sustainable.
        </p>
      </div>

      <div className="space-y-6">
        <BodyFatSelector
          gender={formData.gender}
          selectedValue={Number(formData.bodyFat)}
          onChange={handleBodyFatSelect}
        />

        {/* Primary Goal */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <label className="block font-bold text-gray-900">Primary Goal</label>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: 'weight_loss', label: 'Weight Loss', icon: Scale },
              { value: 'muscle_gain', label: 'Muscle Gain', icon: Dumbbell },
              { value: 'maintenance', label: 'Maintenance', icon: Target }
            ].map(({ value, label, icon: Icon }) => (
              <label
                key={value}
                className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.primaryGoal === value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                <input
                  type="radio"
                  name="primaryGoal"
                  value={value}
                  checked={formData.primaryGoal === value}
                  onChange={onChange}
                  className="sr-only"
                />
                <Icon className={`h-6 w-6 mb-2 ${
                  formData.primaryGoal === value ? 'text-purple-600' : 'text-gray-400'
                }`} />
                <span className={`text-sm font-medium ${
                  formData.primaryGoal === value ? 'text-purple-600' : 'text-gray-600'
                }`}>
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Target Weight (Conditional) */}
        {formData.primaryGoal === 'weight_loss' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Scale className="h-5 w-5 text-blue-600" />
              </div>
              <label className="block font-bold text-gray-900">Target Weight</label>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">{targetWeightDisplay} kg</span>
                <input
                  type="number"
                  value={targetWeightDisplay}
                  onChange={(e) => handleWeightChange(e.target.value)}
                  className="w-20 p-2 text-right border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="0.5"
                  min="40"
                  max={Number(formData.currentWeight) - 0.5}
                />
              </div>
              <input
                type="range"
                value={targetWeightDisplay}
                onChange={(e) => handleWeightChange(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                min="40"
                max={Number(formData.currentWeight) - 0.5}
                step="0.5"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>40 kg</span>
                <span>{(Number(formData.currentWeight) - 0.5).toFixed(1)} kg</span>
              </div>
            </div>
          </div>
        )}

        {/* Weekly Goal (Conditional) */}
        {(formData.primaryGoal === 'weight_loss' || formData.primaryGoal === 'muscle_gain') && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <label className="block font-bold text-gray-900">
                {formData.primaryGoal === 'weight_loss' ? 'Weekly Weight Loss Goal' : 'Monthly Muscle Gain Goal'}
              </label>
            </div>
            <select
              name="weeklyWeightGoal"
              required
              value={formData.weeklyWeightGoal || ''}
              onChange={onChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option value="">Select your goal</option>
              {formData.primaryGoal === 'weight_loss' ? (
                <>
                  <option value="0.25">Lose 0.25 kg per week (Slow)</option>
                  <option value="0.5">Lose 0.5 kg per week (Moderate)</option>
                  <option value="0.75">Lose 0.75 kg per week (Fast)</option>
                  <option value="1">Lose 1 kg per week (Aggressive)</option>
                </>
              ) : (
                <>
                  <option value="0.5">Gain 0.5 kg per month (Conservative)</option>
                  <option value="1">Gain 1 kg per month (Moderate)</option>
                  <option value="1.5">Gain 1.5 kg per month (Aggressive)</option>
                </>
              )}
            </select>
            <p className="mt-2 text-sm text-gray-500">
              {formData.primaryGoal === 'weight_loss'
                ? 'A sustainable rate of weight loss is typically 0.5-1 kg per week.'
                : 'Natural muscle gain is typically limited to 0.5-1 kg per month.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}