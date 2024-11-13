import { create } from 'zustand';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserProfile } from '../types';

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: (userId: string) => Promise<void>;
  addProfile: (userId: string, profile: UserProfile) => Promise<void>;
  updateProfile: (userId: string, profileUpdates: Partial<UserProfile>) => Promise<void>;
}

// Validation functions
const validateNumericField = (value: number | undefined, field: string, min: number, max: number): void => {
  if (value !== undefined) {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error(`Invalid ${field}: must be a number`);
    }
    if (value < min || value > max) {
      throw new Error(`Invalid ${field}: must be between ${min} and ${max}`);
    }
  }
};

const validateRequiredString = (value: string | undefined, field: string): void => {
  if (!value || typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${field} is required`);
  }
};

const validateProfile = (profile: Partial<UserProfile>): void => {
  if ('name' in profile) validateRequiredString(profile.name, 'Name');
  if ('email' in profile) validateRequiredString(profile.email, 'Email');
  if ('gender' in profile && !['male', 'female'].includes(profile.gender!)) {
    throw new Error('Invalid gender value');
  }
  if ('activityLevel' in profile && !['light', 'gym_bro', 'gym_rat'].includes(profile.activityLevel!)) {
    throw new Error('Invalid activity level');
  }
  if ('primaryGoal' in profile && !['weight_loss', 'muscle_gain', 'maintenance'].includes(profile.primaryGoal!)) {
    throw new Error('Invalid primary goal');
  }

  validateNumericField(profile.age, 'age', 13, 120);
  validateNumericField(profile.height, 'height', 140, 220);
  validateNumericField(profile.currentWeight, 'weight', 40, 300);
  validateNumericField(profile.bodyFat, 'body fat', 3, 50);
  validateNumericField(profile.dailyStepsGoal, 'daily steps goal', 0, 50000);
  validateNumericField(profile.dailyCaloriesTarget, 'daily calories target', 1200, 6000);
  validateNumericField(profile.targetWeight, 'target weight', 40, 300);
};

const sanitizeProfileData = (data: Partial<UserProfile>): Partial<UserProfile> => {
  const sanitized: Partial<UserProfile> = { ...data };

  // Convert numeric strings to numbers
  const numericFields: (keyof UserProfile)[] = [
    'age', 'height', 'currentWeight', 'bodyFat', 
    'dailyStepsGoal', 'dailyCaloriesTarget', 'targetWeight'
  ];

  numericFields.forEach(field => {
    if (field in sanitized) {
      const value = sanitized[field];
      if (typeof value === 'string') {
        sanitized[field] = parseFloat(value);
      }
    }
  });

  // Remove undefined or null values
  Object.keys(sanitized).forEach(key => {
    if (sanitized[key as keyof UserProfile] === undefined || 
        sanitized[key as keyof UserProfile] === null) {
      delete sanitized[key as keyof UserProfile];
    }
  });

  return sanitized;
};

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const profileData: UserProfile = {
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        } as UserProfile;
        
        set({ profile: profileData });
      } else {
        set({ profile: null });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      set({ error: 'Failed to fetch profile. Please try again.' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addProfile: async (userId: string, profile: UserProfile) => {
    try {
      set({ isLoading: true, error: null });

      const sanitizedData = sanitizeProfileData(profile);
      validateProfile(sanitizedData);

      const docRef = doc(db, 'users', userId);
      const now = Timestamp.now();
      
      const profileData = {
        ...sanitizedData,
        createdAt: now,
        updatedAt: now
      };

      await setDoc(docRef, profileData);
      set({ 
        profile: {
          ...profile,
          createdAt: now.toDate(),
          updatedAt: now.toDate()
        }
      });
    } catch (error) {
      console.error('Error adding profile:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to save profile' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (userId: string, profileUpdates: Partial<UserProfile>) => {
    try {
      set({ isLoading: true, error: null });

      const sanitizedData = sanitizeProfileData(profileUpdates);
      validateProfile(sanitizedData);

      const docRef = doc(db, 'users', userId);
      const now = Timestamp.now();
      
      const updates = {
        ...sanitizedData,
        updatedAt: now
      };

      await setDoc(docRef, updates, { merge: true });
      
      set((state) => ({
        profile: state.profile ? {
          ...state.profile,
          ...sanitizedData,
          updatedAt: now.toDate()
        } : null
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to update profile' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));