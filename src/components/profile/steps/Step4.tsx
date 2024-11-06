import React from 'react';
import { FormData } from '../../../types/profile';
import {
  calculateBMR,
  calculateTDEE,
  calculateBMI,
  calculateIdealWeights,
  calculateMuscularPotential,
  getBMICategory,
  getBMIColor
} from '../../../utils/profileCalculations';

interface Step4Props {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const bmiCategories = [
  { range: '18.5 or less', label: 'Underweight', color: 'bg-blue-50 text-blue-700' },
  { range: '18.5 – 24.99', label: 'Normal Weight', color: 'bg-green-50 text-green-700' },
  { range: '25 – 29.99', label: 'Overweight', color: 'bg-yellow-50 text-yellow-700' },
  { range: '30+', label: 'Obese', color: 'bg-red-50 text-red-700' }
];

export function Step4({ formData, onChange }: Step4Props) {
  // Get numeric values from formData
  const numericHeight = Number(formData.height);
  const numericWeight = Number(formData.currentWeight);
  const numericAge = Number(formData.age);

  // Calculate metrics
  const bmi = calculateBMI(numericWeight, numericHeight);
  const bmr = calculateBMR(numericWeight, numericHeight, numericAge, formData.gender);
  const tdee = calculateTDEE(bmr, formData.activityLevel);
  const idealWeights = calculateIdealWeights(numericHeight);
  const muscularPotential = calculateMuscularPotential(numericHeight);
  const bmiCategory = getBMICategory(bmi);
  const bmiColorClass = getBMIColor(bmi);

  return (
    <div className="space-y-8">
      {/* Maintenance Calories Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Maintenance Calories</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">{Math.round(tdee)}</p>
            <p className="text-sm text-gray-600">calories per day</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">{Math.round(tdee * 7)}</p>
            <p className="text-sm text-gray-600">calories per week</p>
          </div>
        </div>
        <p className="text-gray-600">
          Based on your stats, the best estimate for your maintenance calories is {Math.round(tdee)} calories per day
          based on the Mifflin-St Jeor Formula, which is widely known to be the most accurate.
        </p>
      </div>

      {/* Ideal Weight Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Ideal Weight: {idealWeights.miller}-{idealWeights.hamwi} kg
        </h3>
        <p className="text-gray-600 mb-4">
          Your ideal body weight is estimated to be between {idealWeights.miller}-{idealWeights.hamwi} kg
          based on various formulas. These formulas are based on your height and represent averages.
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>G.J. Hamwi Formula (1964)</span>
            <span>{idealWeights.hamwi} kg</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>B.J. Devine Formula (1974)</span>
            <span>{idealWeights.devine} kg</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>J.D. Robinson Formula (1983)</span>
            <span>{idealWeights.robinson} kg</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>D.R. Miller Formula (1983)</span>
            <span>{idealWeights.miller} kg</span>
          </div>
        </div>
      </div>

      {/* BMI Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          BMI Score: <span className={bmiColorClass}>{bmi.toFixed(1)}</span>
        </h3>
        <p className="text-gray-600 mb-4">
          Your BMI is <span className={bmiColorClass}>{bmi.toFixed(1)}</span>, which classifies you as{' '}
          <span className={`${bmiColorClass} font-semibold`}>{bmiCategory}</span>
        </p>
        <div className="space-y-2">
          {bmiCategories.map(({ range, label, color }) => (
            <div 
              key={label}
              className={`flex justify-between items-center py-2 px-4 rounded-lg ${
                label === bmiCategory ? color : ''
              }`}
            >
              <span className={label === bmiCategory ? 'font-medium' : 'text-gray-600'}>
                {range}
              </span>
              <span className={label === bmiCategory ? 'font-medium' : 'text-gray-600'}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Muscular Potential */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Maximum Muscular Potential</h3>
        <p className="text-gray-600">
          According to Martin Berkhan's formula, your maximum muscular potential is:
        </p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{muscularPotential.bf5} kg</p>
            <p className="text-sm text-gray-600">at 5% body fat</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{muscularPotential.bf10} kg</p>
            <p className="text-sm text-gray-600">at 10% body fat</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{muscularPotential.bf15} kg</p>
            <p className="text-sm text-gray-600">at 15% body fat</p>
          </div>
        </div>
      </div>
    </div>
  );
}