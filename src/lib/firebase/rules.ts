// Firebase Security Rules

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    function isValidDate(date) {
      return date is timestamp;
    }
    
    function isValidNumber(value) {
      return value is number && value >= 0;
    }
    
    // User document and all nested collections
    match /users/{userId} {
      // Only the owner can read/write their data
      allow read, write: if isOwner(userId);
      
      // Profile document
      match /profile {
        allow read: if isOwner(userId);
        allow write: if isOwner(userId) 
          && request.resource.data.email is string
          && request.resource.data.name is string
          && request.resource.data.gender in ['male', 'female']
          && isValidNumber(request.resource.data.age)
          && isValidNumber(request.resource.data.height)
          && isValidNumber(request.resource.data.currentWeight)
          && isValidDate(request.resource.data.updatedAt);
      }
      
      // Goals document
      match /goals {
        allow read: if isOwner(userId);
        allow write: if isOwner(userId)
          && request.resource.data.primaryGoal in ['weight_loss', 'muscle_gain', 'maintenance']
          && isValidNumber(request.resource.data.dailyStepsGoal)
          && isValidNumber(request.resource.data.dailyCaloriesTarget)
          && isValidDate(request.resource.data.updatedAt);
      }
      
      // Daily Logs collection
      match /logs/{date} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId)
          && ((!('weight' in request.resource.data) || isValidNumber(request.resource.data.weight)))
          && ((!('calories' in request.resource.data) || isValidNumber(request.resource.data.calories)))
          && ((!('steps' in request.resource.data) || isValidNumber(request.resource.data.steps)))
          && isValidDate(request.resource.data.createdAt)
          && isValidDate(request.resource.data.updatedAt);
        allow update: if isOwner(userId)
          && isValidDate(request.resource.data.updatedAt);
        allow delete: if isOwner(userId);
      }
      
      // Weekly Summaries collection
      match /weeklySummaries/{weekId} {
        allow read: if isOwner(userId);
        // Only allow system-generated updates
        allow write: if false;
      }
      
      // Monthly Summaries collection
      match /monthlySummaries/{monthId} {
        allow read: if isOwner(userId);
        // Only allow system-generated updates
        allow write: if false;
      }
      
      // Milestones collection
      match /milestones/{milestoneId} {
        allow read: if isOwner(userId);
        // Only allow system-generated updates
        allow write: if false;
      }
      
      // Streaks document
      match /streaks {
        allow read: if isOwner(userId);
        // Only allow system-generated updates
        allow write: if false;
      }
    }
  }
}