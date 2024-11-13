import { collection, doc, CollectionReference, DocumentReference } from 'firebase/firestore';
import { db } from './firebase';
import type { FirebaseSchema } from './schema';

// Helper function to create typed references
function createCollection<T = any>(path: string) {
  return collection(db, path) as CollectionReference<T>;
}

function createDoc<T = any>(path: string) {
  return doc(db, path) as DocumentReference<T>;
}

// Collection References
export const collections = {
  // User Profile
  getUserProfile: (userId: string) => 
    createDoc<FirebaseSchema['users'][string]['profile']>(`users/${userId}/profile`),

  // Goals
  getUserGoals: (userId: string) => 
    createDoc<FirebaseSchema['users'][string]['goals']>(`users/${userId}/goals`),

  // Daily Logs
  getUserLogs: (userId: string) => 
    createCollection<FirebaseSchema['users'][string]['logs'][string]>(`users/${userId}/logs`),
  
  getUserLogByDate: (userId: string, date: string) => 
    createDoc<FirebaseSchema['users'][string]['logs'][string]>(`users/${userId}/logs/${date}`),

  // Weekly Summaries
  getUserWeeklySummaries: (userId: string) => 
    createCollection<FirebaseSchema['users'][string]['weeklySummaries'][string]>(`users/${userId}/weeklySummaries`),
  
  getUserWeeklySummary: (userId: string, weekId: string) => 
    createDoc<FirebaseSchema['users'][string]['weeklySummaries'][string]>(`users/${userId}/weeklySummaries/${weekId}`),

  // Monthly Summaries
  getUserMonthlySummaries: (userId: string) => 
    createCollection<FirebaseSchema['users'][string]['monthlySummaries'][string]>(`users/${userId}/monthlySummaries`),
  
  getUserMonthlySummary: (userId: string, monthId: string) => 
    createDoc<FirebaseSchema['users'][string]['monthlySummaries'][string]>(`users/${userId}/monthlySummaries/${monthId}`),

  // Milestones
  getUserMilestones: (userId: string) => 
    createCollection<FirebaseSchema['users'][string]['milestones'][string]>(`users/${userId}/milestones`),

  // Streaks
  getUserStreaks: (userId: string) => 
    createDoc<FirebaseSchema['users'][string]['streaks']>(`users/${userId}/streaks`)
};