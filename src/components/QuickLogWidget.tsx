import React from 'react';
import { LucideIcon, Percent, Route, Beef } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { LogValue } from './quicklog/LogValue';
import { LogForm } from './quicklog/LogForm';
import { AdditionalDataPrompt } from './quicklog/AdditionalDataPrompt';
import { useLogState } from './quicklog/useLogState';
import { BodyFatModal } from './modals/BodyFatModal';
import { MacrosModal } from './modals/MacrosModal';
import { DistanceModal } from './modals/DistanceModal';
import type { DailyLog } from '../types';

interface QuickLogWidgetProps {
  icon: LucideIcon;
  label: string;
  unit: string;
  step: number;
  min: number;
  max: number;
  defaultValue: number;
  field: keyof Pick<DailyLog, 'weight' | 'calories' | 'steps'>;
  onLogAdded?: () => void;
}

export function QuickLogWidget({
  icon: Icon,
  label,
  unit,
  step,
  min,
  max,
  defaultValue,
  field,
  onLogAdded
}: QuickLogWidgetProps) {
  const {
    state,
    setState,
    todayLog,
    user,
    updateLog,
    updateProfile,
    handleSubmit
  } = useLogState(field, defaultValue);

  const handleBodyFatSubmit = async (bodyFat: number) => {
    if (!user || !todayLog) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await updateLog(user.uid, todayLog.id, {
        ...todayLog,
        bodyFat,
        updatedAt: new Date()
      });

      await updateProfile(user.uid, {
        bodyFat,
        updatedAt: new Date()
      });

      setState(prev => ({
        ...prev,
        showBodyFatPrompt: false,
        showBodyFatModal: false
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: 'Failed to save body fat. Please try again.'
      }));
      console.error('Error saving body fat:', err);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleMacrosSubmit = async (macros: { proteins: number; fats: number; carbs: number; fiber: number }) => {
    if (!user || !todayLog) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await updateLog(user.uid, todayLog.id, {
        ...todayLog,
        macros,
        updatedAt: new Date()
      });

      setState(prev => ({
        ...prev,
        showMacrosPrompt: false,
        showMacrosModal: false
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: 'Failed to save macros. Please try again.'
      }));
      console.error('Error saving macros:', err);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDistanceSubmit = async (distance: number) => {
    if (!user || !todayLog) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await updateLog(user.uid, todayLog.id, {
        ...todayLog,
        distance,
        updatedAt: new Date()
      });

      setState(prev => ({
        ...prev,
        showDistancePrompt: false,
        showDistanceModal: false
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: 'Failed to save distance. Please try again.'
      }));
      console.error('Error saving distance:', err);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const getPromptConfig = () => {
    switch (field) {
      case 'weight':
        return { icon: Percent, title: 'Add Body Fat?' };
      case 'calories':
        return { icon: Beef, title: 'Add Macros?' };
      case 'steps':
        return { icon: Route, title: 'Add Distance?' };
      default:
        return { icon: Icon, title: '' };
    }
  };

  const hasLoggedToday = todayLog?.[field] !== undefined && todayLog[field] !== null;
  const promptConfig = getPromptConfig();

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-full flex flex-col relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="h-5 w-5 text-indigo-600" />
          <h3 className="text-sm font-medium text-gray-900">{label}</h3>
        </div>

        <AnimatePresence>
          {(state.showBodyFatPrompt || state.showMacrosPrompt || state.showDistancePrompt) && (
            <AdditionalDataPrompt
              icon={promptConfig.icon}
              title={promptConfig.title}
              onAdd={() => {
                if (field === 'weight') {
                  setState(prev => ({ ...prev, showBodyFatPrompt: false, showBodyFatModal: true }));
                } else if (field === 'calories') {
                  setState(prev => ({ ...prev, showMacrosPrompt: false, showMacrosModal: true }));
                } else if (field === 'steps') {
                  setState(prev => ({ ...prev, showDistancePrompt: false, showDistanceModal: true }));
                }
              }}
              onSkip={() => {
                setState(prev => ({
                  ...prev,
                  showBodyFatPrompt: false,
                  showMacrosPrompt: false,
                  showDistancePrompt: false
                }));
              }}
            />
          )}
        </AnimatePresence>

        {hasLoggedToday && !state.isEditing ? (
          <LogValue
            log={todayLog}
            field={field}
            unit={unit}
            onEdit={() => setState(prev => ({ ...prev, isEditing: true }))}
          />
        ) : (
          <LogForm
            value={state.value}
            field={field}
            unit={unit}
            step={step}
            min={min}
            max={max}
            isLoading={state.isLoading}
            error={state.error}
            isEditing={state.isEditing}
            onChange={(value) => setState(prev => ({ ...prev, value }))}
            onSubmit={handleSubmit}
            onCancel={() => setState(prev => ({
              ...prev,
              isEditing: false,
              value: todayLog?.[field] ?? null
            }))}
          />
        )}
      </div>

      <AnimatePresence>
        {state.showBodyFatModal && (
          <BodyFatModal
            isOpen={state.showBodyFatModal}
            onClose={() => setState(prev => ({ ...prev, showBodyFatModal: false }))}
            onSubmit={handleBodyFatSubmit}
            isLoading={state.isLoading}
          />
        )}
        {state.showMacrosModal && (
          <MacrosModal
            isOpen={state.showMacrosModal}
            onClose={() => setState(prev => ({ ...prev, showMacrosModal: false }))}
            onSubmit={handleMacrosSubmit}
            isLoading={state.isLoading}
          />
        )}
        {state.showDistanceModal && (
          <DistanceModal
            isOpen={state.showDistanceModal}
            onClose={() => setState(prev => ({ ...prev, showDistanceModal: false }))}
            onSubmit={handleDistanceSubmit}
            isLoading={state.isLoading}
          />
        )}
      </AnimatePresence>
    </>
  );
}