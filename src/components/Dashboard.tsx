import React, { useState, useEffect } from 'react';
import { useLogsStore } from '../stores/logsStore';
import { useUserStore } from '../stores/userStore';
import { useAuthStore } from '../stores/authStore';
import { QuickLogWidget } from './QuickLogWidget';
import { DailyLogsSection } from './overview/sections/DailyLogsSection';
import { ProjectionSection } from './overview/sections/ProjectionSection';
import { WeekSummarySection } from './overview/sections/WeekSummarySection';
import { GFluxMeter } from './dashboard/GFluxMeter';
import { Scale, Activity, Utensils, ClipboardList, Zap, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { getWeekRange } from '../utils/weekCalculations';
import { calculateGFlux } from '../utils/gfluxCalculations';

export function Dashboard() {
  const { user } = useAuthStore();
  const { logs, fetchLogs, isLoading } = useLogsStore();
  const { profile } = useUserStore();
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0);

  // Fetch logs when component mounts
  useEffect(() => {
    const loadLogs = async () => {
      if (user?.uid) {
        await fetchLogs(user.uid);
      }
    };
    loadLogs();
  }, [user?.uid, fetchLogs]);

  const { start: weekStart, end: weekEnd } = getWeekRange(selectedWeekOffset);
  const { start: prevWeekStart, end: prevWeekEnd } = getWeekRange(selectedWeekOffset - 1);

  // Get logs for selected week and previous week
  const weekLogs = logs
    .filter(log => {
      const logDate = new Date(log.date);
      return logDate >= weekStart && logDate <= weekEnd;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const prevWeekLogs = logs
    .filter(log => {
      const logDate = new Date(log.date);
      return logDate >= prevWeekStart && logDate <= prevWeekEnd;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate weekly totals for G-Flux
  const avgDailyCalories = weekLogs.length > 0 
    ? Math.round(weekLogs.reduce((sum, log) => sum + (log.calories || 0), 0) / weekLogs.length) 
    : 0;
  const avgDailySteps = weekLogs.length > 0 
    ? Math.round(weekLogs.reduce((sum, log) => sum + (log.steps || 0), 0) / weekLogs.length) 
    : 0;

  // Calculate G-Flux
  const gFlux = calculateGFlux(avgDailyCalories, avgDailySteps);

  // Format date for display
  const formatDateRange = () => {
    return `${weekStart.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })} - ${weekEnd.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })}`;
  };

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Rest of the component remains the same */}
      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {/* Week Selector */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedWeekOffset(prev => prev - 1)}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-900 font-medium">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateRange()}</span>
                </div>
                {selectedWeekOffset === 0 && (
                  <div className="text-xs text-indigo-600 font-medium mt-0.5">
                    Current Week
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedWeekOffset(prev => prev + 1)}
                disabled={selectedWeekOffset === 0}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Log Section */}
        <div className="px-4">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Log Your Day</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <QuickLogWidget
                icon={Scale}
                label="Log Weight"
                unit="kg"
                step={0.05}
                min={30}
                max={300}
                defaultValue={profile.currentWeight}
                field="weight"
              />
            </div>
            <div className="col-span-1">
              <QuickLogWidget
                icon={Utensils}
                label="Log Calories"
                unit="kcal"
                step={50}
                min={0}
                max={10000}
                defaultValue={profile.dailyCaloriesTarget}
                field="calories"
              />
            </div>
            <div className="col-span-1">
              <QuickLogWidget
                icon={Activity}
                label="Log Steps"
                unit="steps"
                step={100}
                min={0}
                max={100000}
                defaultValue={profile.dailyStepsGoal}
                field="steps"
              />
            </div>
          </div>
        </div>

        {/* Daily Logs */}
        <div className="px-4">
          <DailyLogsSection
            weekStart={weekStart}
            weekLogs={weekLogs}
            profile={profile}
          />
        </div>

        {/* Week Summary */}
        <div className="px-4">
          <WeekSummarySection
            weekLogs={weekLogs}
            prevWeekLogs={prevWeekLogs}
            profile={profile}
          />
        </div>

        {/* Projection Section */}
        <div className="px-4">
          <ProjectionSection
            weekLogs={weekLogs}
            profile={profile}
            weekStart={weekStart}
            selectedWeekOffset={selectedWeekOffset}
          />
        </div>

        {/* G-Flux Section */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-xl">
              <Zap className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Energy Flux</h2>
              <p className="text-sm text-gray-600">Your metabolic power - how much energy flows through your body</p>
            </div>
          </div>

          <GFluxMeter
            calories={avgDailyCalories}
            steps={avgDailySteps}
            gFlux={gFlux}
          />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Desktop Week Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedWeekOffset(prev => prev - 1)}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-900">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  <span className="text-lg font-medium">{formatDateRange()}</span>
                </div>
                {selectedWeekOffset === 0 && (
                  <div className="text-sm text-indigo-600 font-medium mt-1">
                    Current Week
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedWeekOffset(prev => prev + 1)}
                disabled={selectedWeekOffset === 0}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <ChevronRight className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Log Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
              <ClipboardList className="h-6 w-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Log Your Day</h2>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <QuickLogWidget
              icon={Scale}
              label="Log Weight"
              unit="kg"
              step={0.05}
              min={30}
              max={300}
              defaultValue={profile.currentWeight}
              field="weight"
            />
            <QuickLogWidget
              icon={Utensils}
              label="Log Calories"
              unit="kcal"
              step={50}
              min={0}
              max={10000}
              defaultValue={profile.dailyCaloriesTarget}
              field="calories"
            />
            <QuickLogWidget
              icon={Activity}
              label="Log Steps"
              unit="steps"
              step={100}
              min={0}
              max={100000}
              defaultValue={profile.dailyStepsGoal}
              field="steps"
            />
          </div>

          <DailyLogsSection
            weekStart={weekStart}
            weekLogs={weekLogs}
            profile={profile}
          />
        </div>

        {/* Week Summary */}
        <WeekSummarySection
          weekLogs={weekLogs}
          prevWeekLogs={prevWeekLogs}
          profile={profile}
        />

        {/* Projection Section */}
        <ProjectionSection
          weekLogs={weekLogs}
          profile={profile}
          weekStart={weekStart}
          selectedWeekOffset={selectedWeekOffset}
        />

        {/* G-Flux Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-xl">
              <Zap className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Energy Flux</h2>
              <p className="text-sm text-gray-600">Your metabolic power - how much energy flows through your body</p>
            </div>
          </div>

          <GFluxMeter
            calories={avgDailyCalories}
            steps={avgDailySteps}
            gFlux={gFlux}
          />
        </div>
      </div>
    </>
  );
}