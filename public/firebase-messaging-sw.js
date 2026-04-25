// public/firebase-messaging-sw.js
// Service worker for Firebase Cloud Messaging (push notifications)
// ⚠️ Replace config values with YOUR Firebase project config

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
})

const messaging = firebase.messaging()

// Handle background push notifications
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {}
  self.registration.showNotification(title ?? 'DeviceWatch', {
    body:  body ?? 'A device status changed.',
    icon:  '/icon-192.png',
    badge: '/icon-192.png',
  })
})
