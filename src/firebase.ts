import { initializeApp } from 'firebase/app';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import config from './config.json';

const app = initializeApp(config.firebase);

// Initialize Functions
const functions = getFunctions(app);

// Initialize Firestore
const firestore = getFirestore(app);

// Connect to emulators in development
if (config.emulators?.enabled) {
  console.log('Connecting to Firebase emulators...');
  // Connect to Functions emulator
  connectFunctionsEmulator(
    functions, 
    config.emulators.host, 
    config.emulators.ports.functions
  );
  // Connect to Firestore emulator
  connectFirestoreEmulator(
    firestore, 
    config.emulators.host, 
    config.emulators.ports.firestore
  );
}

export { app, functions, firestore };
