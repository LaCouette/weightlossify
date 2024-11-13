// Re-export everything from a single entry point
export * from './schema';
export * from './collections';
export * from './utils';

// Re-export the Firebase instances from the config
export { auth, db, analytics } from '../../config/firebase';