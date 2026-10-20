import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  updateProfile,
  deleteUser
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

// Google ilə giriş
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

// Header ikonu
const userIcon = document.getElementById("user-icon");
if (userIcon) {
  const personSvg =
    '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" ' +
    'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>';

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      userIcon.href = "login.html";
      userIcon.title = "Daxil ol";
      userIcon.innerHTML = personSvg;
      userIcon.onclick = null;
      return;
    }
    const label = (user.displayName || user.email || "?").trim();
    userIcon.href = "#";
    userIcon.title = label;
    userIcon.innerHTML = '<span class="auth-avatar"></span>';
    userIcon.firstChild.textContent = label[0].toUpperCase();

    const menu = document.createElement("div");
    menu.className = "auth-menu";
    menu.hidden = true;

    const name = document.createElement("span");
    name.textContent = label;

    const out = document.createElement("button");
    out.type = "button";
    out.textContent = "Çıxış";
    out.onclick = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await signOut(auth);
      location.reload();
    };

    const del = document.createElement("button");
    del.type = "button";
    del.textContent = "Hesabı sil";
    del.className = "auth-danger";
    del.onclick = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!confirm("Hesabın həmişəlik silinəcək. Davam edək?")) return;
      try {
        await deleteUser(user);
        location.reload();
      } catch (err) {
        if (err.code === "auth/requires-recent-login") {
          alert("Təhlükəsizlik üçün yenidən daxil ol, sonra hesabı sil.");
          await signOut(auth);
          location.href = "login.html";
        } else {
          alert("Hesabı silmək alınmadı: " + err.code);
        }
      }
    };

    menu.append(name, out, del);
    userIcon.append(menu);

    userIcon.onclick = (e) => {
      e.preventDefault();
      if (e.target.closest(".auth-menu")) return;
      menu.hidden = !menu.hidden;
    };
  });
}