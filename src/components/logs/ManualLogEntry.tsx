import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useLogsStore } from '../../stores/logsStore';
import { useWeightStore } from '../../stores/weightStore';
import { useUserStore } from '../../stores/userStore';
import { formatWeight, parseWeight, validateWeight, WEIGHT_STEP } from '../../utils/weightFormatting';

interface ManualLogEntryProps {
  onComplete: () => void;
}

export function ManualLogEntry({ onComplete }: ManualLogEntryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { addLog } = useLogsStore();
  const updateCurrentWeight = useWeightStore(state => state.updateCurrentWeight);
  const { updateProfile } = useUserStore();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    bodyFat: '',
    calories: '',
    steps: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Validate weight format if provided
      if (formData.weight && !validateWeight(formData.weight)) {
        throw new Error('Invalid weight format. Please use increments of 0.05');
      }

      // Convert form values to numbers or null
      const logData = {
        date: new Date(formData.date).toISOString(),
        weight: formData.weight ? parseWeight(formData.weight) : null,
        bodyFat: formData.bodyFat ? Number(formData.bodyFat) : null,
        calories: formData.calories ? Number(formData.calories) : null,
        steps: formData.steps ? Number(formData.steps) : null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Validate that at least one value is provided
      if (!logData.weight && !logData.bodyFat && !logData.calories && !logData.steps) {
        throw new Error('Please provide at least one value');
      }

      await addLog(user.uid, logData);

      // Update global weight state if weight was logged
      if (logData.weight) {
        updateCurrentWeight(logData.weight);
      }

      // Update user profile body fat if provided
      if (logData.bodyFat) {
        await updateProfile(user.uid, {
          bodyFat: logData.bodyFat,
          updatedAt: new Date()
        });
      }

      // Reset form and close modal
      setFormData({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        bodyFat: '',
        calories: '',
        steps: ''
      });
      setIsOpen(false);
      onComplete();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add log');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span>Add Log Entry</span>
      </button>
    );
  }

  return (
    <div className="relative bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>

      <h3 className="text-lg font-semibold text-gray-900 mb-6">Add Log Entry</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Weight Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            step={WEIGHT_STEP}
            min="30"
            max="300"
            placeholder="Enter weight"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Body Fat Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Body Fat %
          </label>
          <input
            type="number"
            name="bodyFat"
            value={formData.bodyFat}
            onChange={handleChange}
            step="0.1"
            min="3"
            max="50"
            placeholder="Enter body fat percentage"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Calories Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Calories
          </label>
          <input
            type="number"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            step="1"
            min="0"
            max="10000"
            placeholder="Enter calories"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Steps Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Steps
          </label>
          <input
            type="number"
            name="steps"
            value={formData.steps}
            onChange={handleChange}
            step="1"
            min="0"
            max="100000"
            placeholder="Enter steps"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add Entry'}
          </button>
        </div>
      </form>
    </div>
  );
}