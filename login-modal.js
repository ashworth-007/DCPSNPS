



document.addEventListener('DOMContentLoaded', async () => {
    // Fetch and inject modal HTML
    const modalContainer = document.createElement('div');
    try {
        const response = await fetch('login-modal.html');
        const data = await response.text();
        modalContainer.innerHTML = data;
        document.body.appendChild(modalContainer);
    } catch (error) {
        console.error('Error loading modal:', error);
        return;
    }

    // Dynamically import Firebase modules
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js");
    const { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut } = await import("https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js");
    const { getDatabase } = await import("https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js");

    const firebaseConfig = {
        apiKey: "AIzaSyDLm_yXfa58C9yCtoj4PE0YNxXgCY3RY7Q",
        authDomain: "dcpsnps-fe479.firebaseapp.com",
        projectId: "dcpsnps-fe479",
        storageBucket: "dcpsnps-fe479.appspot.com",
        messagingSenderId: "144799129608",
        appId: "1:144799129608:web:9a030aef68f2f20293b1bd",
        measurementId: "G-JWK7ZTTS78",
        databaseURL: "https://dcpsnps-fe479-default-rtdb.firebaseio.com",
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const database = getDatabase(app);

    // Check authentication state
    onAuthStateChanged(auth, (user) => {
        const loginNav = document.getElementById('login-nav');
        const logoutNav = document.getElementById('logout-nav');
        const profileNav = document.getElementById('profile-nav');

        if (user) {
            console.log('User is signed in');
            loginNav.style.display = 'none';
            logoutNav.style.display = 'block';
            profileNav.style.display = 'block';
        } else {
            console.log('User is signed out');
            loginNav.style.display = 'block';
            logoutNav.style.display = 'none';
            profileNav.style.display = 'none';
        }
    });

    // Handle modal functionality
    const loginModal = document.getElementById('loginModal');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const openModalBtn = document.getElementById('login-nav');
    const closeLoginModal = document.querySelector('#loginModal .close');
    const closeForgotPasswordModal = document.getElementById('closeForgotModal');
    const modalLoginBtn = document.getElementById('modalLogin');
    const forgotPasswordLink = document.querySelector('#loginModal .remember-forgot a');
    const backToLoginLink = document.getElementById('backToLogin');
    const resetPasswordBtn = document.getElementById('resetPassword');

    // Open login modal
    openModalBtn?.addEventListener('click', () => {
        loginModal.style.display = 'flex';
    });

    // Close login modal
    closeLoginModal?.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    // Close forgot password modal
    closeForgotPasswordModal?.addEventListener('click', () => {
        forgotPasswordModal.style.display = 'none';
        loginModal.style.display = 'flex';
    });

    // Open forgot password modal
    forgotPasswordLink?.addEventListener('click', (event) => {
        event.preventDefault();
        loginModal.style.display = 'none';
        forgotPasswordModal.style.display = 'flex';
    });

    // Back to login from forgot password modal
    backToLoginLink?.addEventListener('click', (event) => {
        event.preventDefault();
        forgotPasswordModal.style.display = 'none';
        loginModal.style.display = 'flex';
    });

    // Handle login in modal
    modalLoginBtn?.addEventListener('click', async (e) => {
        e.preventDefault();

        const email = document.getElementById('modalEmail').value;
        const password = document.getElementById('modalPassword').value;

        if (email === '' || password === '') {
            alert('Please enter both email and password.');
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Login successful:', user);
            alert('Login successful');
            loginModal.style.display = 'none'; // Close the modal on successful login
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Login failed:', errorCode, errorMessage);
            alert('Login failed: ' + errorMessage);
        }
    });

    // Handle password reset
    resetPasswordBtn?.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('forgotEmail').value;

        if (email === '') {
            alert('Please enter your email address.');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            alert('Password reset email sent successfully!');
            forgotPasswordModal.style.display = 'none';
            loginModal.style.display = 'flex';
        } catch (error) {
            console.error('Error sending password reset email:', error);
            alert('Error: ' + error.message);
        }
    });

    // Handle logout button click
    document.getElementById("logout")?.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            console.log("Sign-out successful.");
            alert("Sign-out successful.");
            window.location.href = "index.html";
        } catch (error) {
            console.error("Sign-out error:", error.message);
        }
    });

    // Handle click outside modals to close
    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        } else if (event.target === forgotPasswordModal) {
            forgotPasswordModal.style.display = 'none';
        }
    });
});
