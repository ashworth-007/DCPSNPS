import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

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
const db = getFirestore(app);

// Function to show the edit modal
export function openEditModal(postId) {
    const postRef = doc(db, "posts", postId);
    getDoc(postRef).then((postSnapshot) => {
        if (postSnapshot.exists()) {
            const postData = postSnapshot.data();
            document.getElementById("edit-post-id").value = postId;
            document.getElementById("edit-post-title").value = postData.title || "";
            document.getElementById("edit-post-content").value = postData.content || "";
            document.getElementById("edit-modal").style.display = "block";
        } else {
            alert("Post not found.");
        }
    }).catch((error) => {
        console.error("Error fetching post:", error);
    });
}

// Function to close the edit modal
export function closeEditModal() {
    document.getElementById("edit-modal").style.display = "none";
}

// Function to handle form submission
document.getElementById("edit-post-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const postId = document.getElementById("edit-post-id").value;
    const title = document.getElementById("edit-post-title").value;
    const content = document.getElementById("edit-post-content").value;

    const postRef = doc(db, "posts", postId);

    try {
        // Update post in Firestore
        await updateDoc(postRef, {
            title,
            content,
        });

        alert("Post updated successfully!");
        closeEditModal(); // Close modal
        // Optionally refresh posts or update the UI
    } catch (error) {
        console.error("Error updating post:", error);
        alert("Error updating post.");
    }
});
