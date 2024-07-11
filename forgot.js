e

    firebase.initializeApp(firebaseConfig);
    document.getElementById('ForgotPassword').addEventListener("submit", submitForm);
    function submitForm(e)
    {
    e.preventDefault();
    email=document.getElementById('email').value;
    firebase.auth().sendPasswordResetEmail(email)
    .then(function() {
        alert("Mail Sent");
        })
    .catch((error) => {
        alert("We couldn't find an account associated with this email. Please try with an alternate email.");
        });
    }
    