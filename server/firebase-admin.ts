import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  type: "service_account",
  client_email: "firebase-adminsdk-fbsvc@merakifest-d9822.iam.gserviceaccount.com",
  project_id: process.env.VITE_FIREBASE_PROJECT_ID,
};

const adminApp = initializeApp({
  credential: cert(serviceAccount),
  projectId: process.env.VITE_FIREBASE_PROJECT_ID
});

export const adminDb = getFirestore(adminApp);
