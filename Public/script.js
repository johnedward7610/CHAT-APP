// 1. IMPORT FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, addDoc, collection, serverTimestamp, onSnapshot, query, orderBy, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// 2. FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDXXQvWziaNYaStkNkDjDclNxrVa_7qYX8",
  authDomain: "chat-34ff3.firebaseapp.com",
  projectId: "chat-34ff3",
  storageBucket: "chat-34ff3.firebasestorage.app",
  messagingSenderId: "391966829170",
  appId: "1:391966829170:web:2b9fa454e8be176b7930eb",
  measurementId: "G-81MNVPKD3W"
};

// 3. INIT FIREBASE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 4. DOM ELEMENTS
const button = document.getElementById('send');
const inputtext = document.getElementById('input');
const chatbox = document.getElementById("chatbox");
const logoutbtn = document.getElementById('logout');

// 5. SCROLL TO BOTTOM
function scrollTobottom() {
  chatbox.scrollTo({
    top: chatbox.scrollHeight,
    behavior: 'smooth'
  });
}

// 6. CHECK LOGIN
let currentUser = null;
let currentUsername = "Anonymous";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "loginpage.html";
    return;
  }
  currentUser = user;
  
  // Load username from Firestore
  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (userDoc.exists()) {
    currentUsername = userDoc.data().username || "Anonymous";
  }
  
  // Start listening to messages after login
  listenMessages();
});

// 7. SEND MESSAGE
button.addEventListener('click', async function() {
  const inputvalue = inputtext.value.trim();
  if (inputvalue === "") return;
  
  await addDoc(collection(db, "messages"), {
    text: inputvalue,
    senderUid: currentUser.uid,
    senderName: currentUsername,
    createdAt: serverTimestamp()
  });
  
  inputtext.value = "";
});

// 8. LISTEN TO MESSAGES IN REAL-TIME
function listenMessages() {
  const q = query(collection(db, "messages"), orderBy("createdAt"));
  onSnapshot(q, (snapshot) => {
    chatbox.innerHTML = "";
    snapshot.forEach(doc => {
  const msg = doc.data();
  const text = document.createElement('div');
  
  // Add class depending on who sent it
  if (msg.senderUid === currentUser.uid) {
    text.className = "chathead mine"; // your messages
  } else {
    text.className = "chathead other"; // others' messages
  }
  
  text.innerText = `${msg.senderName}: ${msg.text}`;
  chatbox.appendChild(text);
});
    scrollTobottom();
  });
}

// 9. LOGOUT
logoutbtn.addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = "loginpage.html";
  });
});
