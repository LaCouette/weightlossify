import React, { useEffect } from 'react';
import { Activity, Scale, Utensils, Moon } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { ProgressChart } from './ProgressChart';
import { QuickLogWidget } from './QuickLogWidget';
import { GoalProgress } from './GoalProgress';
import { MotivationalCard } from './MotivationalCard';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import { useLogsStore } from '../stores/logsStore';

export function Dashboard() {
  const { user } = useAuthStore();
  const { profile } = useUserStore();
  const { logs, fetchLogs, isLoading: logsLoading } = useLogsStore();

  useEffect(() => {
    if (user?.uid) {
      fetchLogs(user.uid);
    }
  }, [user?.uid, fetchLogs]);

  if (!profile) {
    return null;
  }

  const latestLog = logs[0] || null;
  const previousLog = logs[1] || null;

  const getMetricChange = (current?: number, previous?: number): string | undefined => {
    if (current === undefined || previous === undefined) return undefined;
    const diff = current - previous;
    return `${diff > 0 ? '+' : ''}${diff.toFixed(1)}`;
  };

  const metrics = [
    {
      icon: Scale,
      label: 'Current Weight',
      value: latestLog?.weight ? `${latestLog.weight} kg` : `${profile.currentWeight} kg`,
      change: getMetricChange(latestLog?.weight, previousLog?.weight),
    },
    {
      icon: Activity,
      label: 'Daily Steps',
      value: latestLog?.steps ? latestLog.steps.toLocaleString() : '0',
      change: getMetricChange(latestLog?.steps, previousLog?.steps),
    },
    {
      icon: Utensils,
      label: 'Calories',
      value: latestLog?.calories ? latestLog.calories.toLocaleString() : '0',
      change: getMetricChange(latestLog?.calories, previousLog?.calories),
    },
    {
      icon: Moon,
      label: 'Sleep Quality',
      value: latestLog?.sleep ? `${latestLog.sleep.duration} hrs` : 'No data',
      change: getMetricChange(latestLog?.sleep?.duration, previousLog?.sleep?.duration),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <MotivationalCard />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickLogWidget
          icon={Scale}
          label="Log Weight"
          unit="kg"
          step={0.1}
          min={30}
          max={300}
          defaultValue={latestLog?.weight || profile.currentWeight}
          field="weight"
        />
        <QuickLogWidget
          icon={Utensils}
          label="Log Calories"
          unit="kcal"
          step={50}
          min={0}
          max={10000}
          defaultValue={latestLog?.calories || profile.dailyCaloriesTarget}
          field="calories"
        />
        <QuickLogWidget
          icon={Activity}
          label="Log Steps"
          unit="steps"
          step={100}
          min={0}
          max={100000}
          defaultValue={latestLog?.steps || 0}
          field="steps"
        />
        <QuickLogWidget
          icon={Moon}
          label="Log Sleep"
          unit="hrs"
          step={0.5}
          min={0}
          max={24}
          defaultValue={latestLog?.sleep?.duration || 8}
          field="sleep"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profile.primaryGoal === 'weight_loss' && profile.targetWeight && (
          <GoalProgress
            label="Weight Loss Progress"
            current={latestLog?.weight || profile.currentWeight}
            target={profile.targetWeight}
            unit="kg"
          />
        )}
        <GoalProgress
          label="Daily Calorie Goal"
          current={latestLog?.calories || 0}
          target={profile.dailyCaloriesTarget}
          unit="kcal"
        />
        <GoalProgress
          label="Daily Steps Goal"
          current={latestLog?.steps || 0}
          target={profile.dailyStepsGoal}
          unit="steps"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Weight Progress</h3>
          <ProgressChart type="weight" data={logs} />
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Sleep Quality</h3>
          <ProgressChart type="sleep" data={logs} />
        </div>
      </div>
    </div>
  );
}