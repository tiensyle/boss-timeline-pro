// Google Firebase configuration for Boss Timeline Pro
// GitHub Pages serves static files; the existing Vercel deployment runs the relay.
window.BOSS_TIMELINE_DISCORD_API = window.location.origin === "https://tiensyle.github.io"
  ? "https://bosschill.vercel.app/api/discord"
  : "/api/discord";
window.BOSS_TIMELINE_FIREBASE = {
  apiKey: "AIzaSyCfVwcvXqDeurizrqEbHmGopNIPHFa-D7Q",
  authDomain: "time-boss-chill.firebaseapp.com",
  databaseURL: "https://time-boss-chill-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "time-boss-chill",
  storageBucket: "time-boss-chill.firebasestorage.app",
  messagingSenderId: "570269335733",
  appId: "1:570269335733:web:db918759f03c6c1f13fefc",
  measurementId: "G-Z6D8SJB48X"
};
