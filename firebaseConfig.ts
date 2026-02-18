
/**
 * Файл конфігурації Firebase з використанням змінних оточення.
 * На Vercel додайте ці змінні у розділі Settings -> Environment Variables.
 * Використовуйте префікс VITE_ (якщо використовуєте Vite) або залиште як process.env для стандартних збірок.
 */

export const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "ВАШ_API_KEY",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "pokermaster-academy.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "pokermaster-academy",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "pokermaster-academy.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_SENDER_ID || "ВАШ_SENDER_ID",
  appId: process.env.VITE_FIREBASE_APP_ID || "ВАШ_APP_ID",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "ВАШ_G_ID"
};
