import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 1) Firebase-in verdiyi firebaseConfig blokunu bura yapışdır
const firebaseConfig = {
  apiKey: "AIzaSyDw0Ap6Gat8kY6PzJBDzV83H0dnJWuuUrY",
  authDomain: "sportmovo-6b064.firebaseapp.com",
  projectId: "sportmovo-6b064",
  storageBucket: "sportmovo-6b064.firebasestorage.app",
  messagingSenderId: "1061605343067",
  appId: "1:1061605343067:web:fea36846b547268edfa47e",
  measurementId: "G-QK07T8ZVYC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const errors = {
  "auth/email-already-in-use": "Bu email ilə artıq qeydiyyatdan keçilib.",
  "auth/invalid-email": "Email ünvanı düzgün deyil.",
  "auth/weak-password": "Şifrə ən azı 6 simvol olmalıdır.",
  "auth/invalid-credential": "Email və ya şifrə yanlışdır.",
  "auth/user-not-found": "Bu email ilə hesab tapılmadı.",
  "auth/wrong-password": "Email və ya şifrə yanlışdır.",
  "auth/too-many-requests": "Çox cəhd edildi. Bir az sonra yenidən yoxla.",
  "auth/popup-closed-by-user": "Google pəncərəsi bağlandı.",
  "auth/unauthorized-domain": "Bu domen Firebase-də icazəli deyil (Authorized domains)."
};

function showError(err) {
  const box = document.getElementById("auth-error");
  if (box) box.textContent = errors[err.code] || "Xəta baş verdi: " + err.code;
}

const home = "index.html";

// Qeydiyyat
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = registerForm.name.value.trim();
    const email = registerForm.email.value.trim();
    const password = registerForm.password.value;
    if (password !== registerForm.password2.value) {
      document.getElementById("auth-error").textContent = "Şifrələr eyni deyil.";
      return;
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
      location.href = home;
    } catch (err) {
      showError(err);
    }
  });
}

// Giriş
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginForm.email.value.trim(), loginForm.password.value);
      location.href = home;
    } catch (err) {
      showError(err);
    }
  });
}

// Google ilə giriş (hər iki səhifədə)
const googleBtn = document.getElementById("google-btn");
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      location.href = home;
    } catch (err) {
      showError(err);
    }
  });
}

// Header-dəki link: id="auth-link" olan elementi yeniləyir (istənilən səhifədə)
const authLink = document.getElementById("auth-link");
if (authLink) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      authLink.textContent = "Çıxış (" + (user.displayName || user.email) + ")";
      authLink.href = "#";
      authLink.onclick = async (e) => {
        e.preventDefault();
        await signOut(auth);
        location.reload();
      };
    } else {
      authLink.textContent = "Daxil ol";
      authLink.href = "login.html";
      authLink.onclick = null;
    }
  });
}
