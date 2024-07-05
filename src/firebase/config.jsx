import { initializeApp } from "firebase/app";

import { getMessaging, getToken, onMessage } from "firebase/messaging";

//Firebase Config values imported from .env file
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Messaging service
 const messaging = getMessaging(app);

export const generateToken = async ()=>{
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPID_KEY,
    });
    localStorage.setItem("fireBaseToken", token);
    console.log(token);
  } else if (permission === "denied") {
    // Notifications are blocked
    // alert("You denied the notification");
    localStorage.removeItem("fireBaseToken");
  } else if(permission==='default') {
    localStorage.removeItem("fireBaseToken");
  }
  return permission
}

  // Listen for messages when the app is in the foreground
  onMessage(messaging, (payload) => {
    console.log("Message received. ", payload);
    const notificationTitle = payload.data.title;
    const notificationOptions = {
      body: payload.data.body,
      icon: payload.data.image,
      data: payload.data,
    };
    const notification = new Notification(
      notificationTitle,
      notificationOptions
    );
    notification.onclick = (event) => {
      event.preventDefault();
      window.open(notificationOptions.data.url);
    };
  });