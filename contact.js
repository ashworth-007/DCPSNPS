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
// initialize firebase
firebase.initializeApp(firebaseConfig);

// reference your database
var contactFormDB = firebase.database().ref("contact");

document.getElementById("contact").addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();

  var name = getElementVal("name");
  var emailid = getElementVal("emailid");
  var msgContent = getElementVal("msgContent");
  var country = getElementVal("state");
  let isValid = true;

  if (!name) {
    setError("name");
   
    isValid = false;
  } else {
    clearError("name");
  }

  if (!emailid || !validateEmail(emailid)) {
    setError("emailid");
    isValid = false;
  } else {
    clearError("emailid");
  }

  if (!state) {
    setError("state");
    isValid = false;
  } else {
    clearError("state");
  }

  if (!msgContent) {
    setError("msgContent");
    isValid = false;
  } else {
    clearError("msgContent");
  }
  if (!isValid) {
    alert("Please fill in all fields.");
    return;
  }
  saveMessages(name, emailid, msgContent, country);
 
  //   enable alert
  document.querySelector(".alert").style.display = "block";

  //   remove the alert
  setTimeout(() => {
    document.querySelector(".alert").style.display = "none";
  }, 3000);

  //   reset the form
  document.getElementById("contact").reset();
}

const saveMessages = (name, emailid, msgContent, country) => {
  var newContactForm = contactFormDB.push();

  newContactForm.set({
    name: name,
    emailid: emailid,
    msgContent: msgContent,
    country: country
  });
};

const getElementVal = (id) => {
  return document.getElementById(id).value;
};
const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
  return re.test(String(email).toLowerCase());
};

const setError = (id) => {
  document.getElementById(id).parentElement.classList.add("error");
};
const clearError = (id) => {
  document.getElementById(id).parentElement.classList.remove("error");
};
