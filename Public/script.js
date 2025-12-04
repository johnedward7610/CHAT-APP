import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, collectionGroup, getDocs } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDXXQvWziaNYaStkNkDjDclNxrVa_7qYX8",
  authDomain: "chat-34ff3.firebaseapp.com",
  projectId: "chat-34ff3",
  storageBucket: "chat-34ff3.firebasestorage.app",
  messagingSenderId: "391966829170",
  appId: "1:391966829170:web:2b9fa454e8be176b7930eb",
  measurementId: "G-81MNVPKD3W"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Map genre sections
const sections = {
  'Romance': document.getElementById('body-romance').querySelector('.content'),
  'Action': document.getElementById('body-action').querySelector('.content'),
  'Horror': document.getElementById('body-horror').querySelector('.content')
};

// Book overlay
const bookOverlay = document.createElement('div');
bookOverlay.id = 'bookOverlay';
document.body.appendChild(bookOverlay);

const closeBtn = document.createElement('button');
closeBtn.textContent = 'Close';
bookOverlay.appendChild(closeBtn);
closeBtn.addEventListener('click', () => {
  bookOverlay.style.display = 'none';
});

const bookTitle = document.createElement('h2');
bookOverlay.appendChild(bookTitle);

const bookContent = document.createElement('div');
bookOverlay.appendChild(bookContent);

// Load novels from Firestore
async function loadNovels() {
  try {
    const querySnapshot = await getDocs(collectionGroup(db, 'novels'));

    // Clear sections
    Object.values(sections).forEach(sec => sec.innerHTML = '');

    querySnapshot.forEach(doc => {
      const novel = doc.data();
      const title = novel.title || 'Untitled';
      const genre = novel.genre || 'Misc';
      const story = novel.story || '';

      const block = document.createElement('div');
      block.className = 'block';
      block.textContent = title;

      // Click to open overlay
      block.addEventListener('click', () => {
        bookTitle.textContent = title;
        bookContent.textContent = story;
        bookOverlay.style.display = 'block';
      });

      if (sections[genre]) sections[genre].appendChild(block);
    });
  } catch (err) {
    console.error('Error loading novels:', err);
  }
}

// Initial load
window.onload = loadNovels;

// Existing page buttons
const all = document.getElementById('all');
const body = document.getElementById('body-romance'); // example
const setting = document.getElementById('settings');
const page = document.getElementById('overlap');
const back = document.getElementById('return');
const list = document.getElementById('listgen');

all.addEventListener('click', () => {
  body.style.display = body.style.display === "none" ? "" : "none";
  list.style.display = body.style.display === "none" ? "" : "none";
});

setting.addEventListener('click', () => {
  page.style.display = page.style.display === "block" ? "none" : "block";
});

back.addEventListener('click', () => {
  page.style.display = "none";
});
