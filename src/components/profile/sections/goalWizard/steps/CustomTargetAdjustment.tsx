import React from 'react';
import { UserProfile } from '../../../../../types/profile';
import { CustomPlanBuilder } from '../../../steps/customPlan/CustomPlanBuilder';

interface CustomTargetAdjustmentProps {
  profile: UserProfile;
  onChange: (updates: Partial<UserProfile>) => void;
}

export function CustomTargetAdjustment({ profile, onChange }: CustomTargetAdjustmentProps) {
  return <CustomPlanBuilder profile={profile} onChange={onChange} />;
}