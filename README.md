# 📡 DeviceWatch — Real-Time Device Monitor

Monitor online/offline status of all your devices in real-time using Firebase + Next.js.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Sign-in methods:
   - ✅ Anonymous
   - ✅ Email/Password
4. Create **Firestore Database** (start in production mode)
5. Go to **Project Settings** → Your Apps → Add Web App
6. Copy your config and paste it into:
   - `src/lib/firebase.ts`
   - `public/firebase-messaging-sw.js`

### 3. Deploy Firestore Rules
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

### 4. Run the app
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout + toast provider
│   ├── page.tsx            # Auth gate (login or dashboard)
│   └── globals.css         # Tailwind base styles
├── components/
│   ├── Dashboard.tsx       # Main dashboard UI
│   ├── DeviceCard.tsx      # Individual device card
│   └── LoginPage.tsx       # Auth forms
├── hooks/
│   ├── useAuth.ts          # Firebase Auth hook
│   ├── useDevices.ts       # Firestore CRUD + real-time sync
│   └── useConnectivity.ts  # Browser online/offline detection
└── lib/
    └── firebase.ts         # Firebase initialization

public/
├── manifest.json           # PWA manifest
└── firebase-messaging-sw.js # FCM service worker
```

---

## ✨ Features

| Feature | Status |
|---------|--------|
| Real-time device status | ✅ |
| Online/Offline detection | ✅ |
| Network type detection | ✅ |
| Add / Remove devices | ✅ |
| Rename devices | ✅ |
| Primary device alerts | ✅ |
| Email + Anonymous auth | ✅ |
| Firestore security rules | ✅ |
| PWA installable | ✅ |
| Dark theme | ✅ |
| Toast notifications | ✅ |

---

## 🔔 Push Notifications (FCM)

To enable push notifications:
1. In Firebase Console → Project Settings → Cloud Messaging
2. Get your **VAPID key**
3. In `Dashboard.tsx`, initialize FCM with your VAPID key
4. The service worker (`firebase-messaging-sw.js`) handles background notifications

---

## 📱 PWA Install

On Chrome/Edge: Click the install icon in the address bar.  
On Android: "Add to Home Screen" from browser menu.

---

## 🔐 Security

- Each user can only access their own devices (Firestore rules enforced)
- Anonymous login for quick access
- Email/password for persistent accounts
