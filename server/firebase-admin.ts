
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  type: "service_account",
  client_email: "firebase-adminsdk-fbsvc@merakifest-d9822.iam.gserviceaccount.com",
  project_id: "merakifest-d9822",
};

const adminApp = initializeApp({
  credential: cert(serviceAccount),
  projectId: "merakifest-d9822"
});

export const adminDb = getFirestore(adminApp);
