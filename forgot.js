// e

//     firebase.initializeApp(firebaseConfig);
//     document.getElementById('ForgotPassword').addEventListener("submit", submitForm);
//     function submitForm(e)
//     {
//     e.preventDefault();
//     email=document.getElementById('email').value;
//     firebase.auth().sendPasswordResetEmail(email)
//     .then(function() {
//         alert("Mail Sent");
//         })
//     .catch((error) => {
//         alert("We couldn't find an account associated with this email. Please try with an alternate email.");
//         });
//     }

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js';
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js';

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Show login modal
document.getElementById('loginModal').style.display = 'block';

// Handle closing of login modal
document.querySelector('#loginModal .close').addEventListener('click', function() {
    document.getElementById('loginModal').style.display = 'none';
});

// Handle opening of forgot password modal
document.getElementById('forgotPasswordLink').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('forgotPasswordModal').style.display = 'block';
});

// Handle closing of forgot password modal and returning to login modal
document.getElementById('closeForgotModal').addEventListener('click', function() {
    document.getElementById('forgotPasswordModal').style.display = 'none';
    document.getElementById('loginModal').style.display = 'block';
});

// Handle login
document.getElementById('modalLogin').addEventListener('click', async function(event) {
    event.preventDefault();
    const email = document.getElementById('modalEmail').value;
    const password = document.getElementById('modalPassword').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in:', userCredential.user);
        document.getElementById('loginModal').style.display = 'none';
    } catch (error) {
        console.error('Error signing in:', error);
        alert('Error: ' + error.message);
    }
});

// Handle password reset
document.getElementById('resetPassword').addEventListener('click', async function(event) {
    event.preventDefault();
    const email = document.getElementById('forgotEmail').value;

    if (email) {
        try {
            await sendPasswordResetEmail(auth, email);
            alert('Password reset email sent successfully!');
            document.getElementById('forgotPasswordModal').style.display = 'none';
            document.getElementById('loginModal').style.display = 'block';
        } catch (error) {
            console.error('Error sending password reset email:', error);
            alert('Error: ' + error.message);
        }
    } else {
        alert('Please enter a valid email address.');
    }
});
