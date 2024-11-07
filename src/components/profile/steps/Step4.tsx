import React from 'react';
import { Activity, Scale, Target, BarChart, Ruler, TrendingUp } from 'lucide-react';
import {
  calculateBMR,
  calculateBMI,
  calculateIdealWeight,
  calculateMaxMuscularPotential,
  getBMIClassification,
} from '../../../utils/calculations';

interface Step4Props {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const bmiCategories = [
  { range: '< 18.5', label: 'Underweight', color: 'from-blue-500 to-blue-600', lightColor: 'from-blue-50 to-blue-100' },
  { range: '18.5 – 24.9', label: 'Normal Weight', color: 'from-green-500 to-green-600', lightColor: 'from-green-50 to-green-100' },
  { range: '25 – 29.9', label: 'Overweight', color: 'from-yellow-500 to-yellow-600', lightColor: 'from-yellow-50 to-yellow-100' },
  { range: '≥ 30', label: 'Obese', color: 'from-red-500 to-red-600', lightColor: 'from-red-50 to-red-100' }
];

export function Step4({ formData, onChange }: Step4Props) {
  const height = Number(formData.height);
  const weight = Number(formData.currentWeight);
  const age = Number(formData.age);
  const bodyFat = Number(formData.bodyFat);

  const bmi = calculateBMI(weight, height);
  const bmr = calculateBMR(weight, height, age, formData.gender, bodyFat);
  const idealWeights = calculateIdealWeight(height);
  const muscularPotential = calculateMaxMuscularPotential(height);
  const bmiCategory = getBMIClassification(bmi);
  const currentBmiCategory = bmiCategories.find(cat => cat.label === bmiCategory);

  // Calculate Lean Body Mass
  const leanBodyMass = weight * (1 - bodyFat / 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Your Health Analysis</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Based on your measurements, we've analyzed your current health metrics and potential targets.
        </p>
      </div>

      {/* Current Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <Ruler className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Height</span>
          </div>
          <div className="text-2xl font-bold text-purple-700">{height} cm</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Weight</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">{weight} kg</div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-900">BMR</span>
          </div>
          <div className="text-2xl font-bold text-emerald-700">{Math.round(bmr)}</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Lean Mass</span>
          </div>
          <div className="text-2xl font-bold text-orange-700">{Math.round(leanBodyMass)} kg</div>
        </div>
      </div>

      {/* BMI Section */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
            <BarChart className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Body Mass Index (BMI)</h3>
            <p className="text-sm text-gray-600">A measure of body fat based on height and weight</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="space-y-2">
            <div className={`text-5xl font-bold bg-gradient-to-r ${currentBmiCategory?.color} text-transparent bg-clip-text`}>
              {bmi.toFixed(1)}
            </div>
            <div className={`inline-block px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${currentBmiCategory?.lightColor}`}>
              {bmiCategory}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
            <div className="space-y-2">
              {bmiCategories.map(({ range, label, color, lightColor }) => (
                <div 
                  key={label}
                  className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                    label === bmiCategory 
                      ? `bg-gradient-to-r ${lightColor} border border-${color.split('-')[0]}-200` 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm font-medium">{range}</span>
                  <span className={`text-sm ${label === bmiCategory ? `bg-gradient-to-r ${color} text-transparent bg-clip-text font-bold` : 'text-gray-600'}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ideal Weight Range Section */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-green-100 to-teal-100 rounded-xl">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Ideal Weight Range</h3>
              <p className="text-sm text-gray-600">Based on different calculation methods</p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(idealWeights).map(([formula, weight]) => (
              <div key={formula} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-600">
                      {formula.charAt(0).toUpperCase() + formula.slice(1)} Formula
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{weight} kg</div>
                  </div>
                  <div className={`w-2 h-full rounded-full ${
                    Math.abs(weight - formData.currentWeight) <= 5 ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                </div>
                <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all"
                    style={{
                      width: `${(formData.currentWeight / weight) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Muscular Potential Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Muscular Potential</h3>
              <p className="text-sm text-gray-600">Maximum muscular development at different body fat levels</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: '5% Body Fat', value: muscularPotential.at5, color: 'bg-red-500', lightColor: 'bg-red-50', textColor: 'text-red-700' },
              { label: '10% Body Fat', value: muscularPotential.at10, color: 'bg-orange-500', lightColor: 'bg-orange-50', textColor: 'text-orange-700' },
              { label: '15% Body Fat', value: muscularPotential.at15, color: 'bg-green-500', lightColor: 'bg-green-50', textColor: 'text-green-700' }
            ].map(({ label, value, color, lightColor, textColor }) => (
              <div key={label} className={`${lightColor} rounded-lg p-4 border border-gray-200`}>
                <div className="flex justify-between items-center">
                  <span className={`font-medium ${textColor}`}>{label}</span>
                  <span className="text-2xl font-bold text-gray-900">{value} kg</span>
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${color} transition-all`}
                    style={{
                      width: `${(value / muscularPotential.at15) * 100}%`
                    }}
                    />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}