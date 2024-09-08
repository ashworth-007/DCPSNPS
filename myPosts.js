// Import Firebase modules
  
  // Ensure to import `deleteDoc` from Firebase Firestore
  import { deleteDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  runTransaction,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

// Firebase configuration
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
const auth = getAuth(app);
const db = getFirestore(app);

// Function to fetch posts created by the current user
async function fetchUserPosts() {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    console.log("No user is signed in.");
    return;
  }

  try {
    const postsContainer = document.getElementById("posts-container");
    postsContainer.innerHTML = ""; // Clear any existing posts
    console.log("Fetching user posts...");

    // Query for posts where userId matches the current user's ID
    const postsCollection = collection(db, "posts");
    const postsQuery = query(
      postsCollection,
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(postsQuery);

    if (querySnapshot.empty) {
      console.log("No posts found for the user.");
      postsContainer.innerHTML = "No posts available.";
    } else {
      querySnapshot.forEach((doc) => {
        const postId = doc.id;
        const postData = doc.data();
        console.log("Post Data:", postId, postData);
        renderPost(postId, postData); // Render each post
      });
    }
  } catch (error) {
    console.error("Error fetching user posts:", error);
    document.getElementById("posts-container").innerHTML =
      "Error fetching posts. Check console for details.";
  }
}


function editPost(postId) {
    const postRef = doc(db, "posts", postId);
  
    getDoc(postRef).then((postSnapshot) => {
      if (postSnapshot.exists()) {
        const postData = postSnapshot.data();
  
        const postIdInput = document.getElementById("edit-post-id");
        const postTitleInput = document.getElementById("edit-post-title");
        const postContentInput = document.getElementById("edit-post-content");
        const postImageInput = document.getElementById("edit-post-image");
  
        // Check if elements are found
        if (!postIdInput || !postTitleInput || !postContentInput || !postImageInput) {
          console.error("One or more form elements are missing.");
          return;
        }
  
        // Update element values
        postIdInput.value = postId;
        postTitleInput.value = postData.title || "";
        postContentInput.value = postData.content || "";
        postImageInput.value = postData.imageUrl || "";
  
        // Show the modal
        document.getElementById("edit-modal").style.display = "block";
      } else {
        alert("Post not found.");
      }
    }).catch((error) => {
      console.error("Error fetching post:", error);
    });
  }
  
  
  // Function to delete a post
  async function deletePost(postId) {
    const confirmDelete = confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "posts", postId));
        alert("Post deleted successfully!");
        fetchUserPosts(); // Refresh posts
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Error deleting post.");
      }
    }
  }
  
  // Update `renderPost` function to include edit and delete functionality
  async function renderPost(postId, postData) {
    const postsContainer = document.getElementById("posts-container");
    const postDiv = document.createElement("div");
    postDiv.className = "post";
    postDiv.id = `post-${postId}`;
  
    const userAction = await getUserAction(postId);
    const userName = await getUserName(postData.userId);
    // <i class="fas fa-edit" onclick="editPost('${postId}')"></i>
    postDiv.innerHTML = `
          <div class="displayname">
              <div class="box1">
                  <div class="person-icon"><i class='bx bxs-user'></i></div>
                  <div class="user-name">${userName || "Anonymous"}</div>
              </div>
              <div class="post-actions-right">
                  
                  <i class="fas fa-trash" onclick="deletePost('${postId}')"></i>
              </div>
              <div class="menu-icon">
                  <i class='bx bx-dots-horizontal-rounded'></i>
                  <div class="post-options">
                      <button onclick="editPost('${postId}')"><i class="fas fa-edit"></i></button>
                      <button onclick="deletePost('${postId}')"><i class="fas fa-trash-alt"></i></button>
                  </div>
              </div>
          </div>
          <div class="post-content">
              <img src="${postData.imageUrl || "default-image.jpg"}" alt="Post Image" class="post-image" onerror="handleImageError(this)">
          </div>
          <div class="post-actions">
              <div>
                  <button class="like-button" id="like-${postId}" onclick="likePost('${postId}')">${postData.likes || 0} <i class="bx bxs-like"></i></button>
                  <button class="dislike-button" id="dislike-${postId}" onclick="dislikePost('${postId}')">${postData.dislikes || 0} <i class="bx bxs-dislike"></i></button>
              </div>
              <div>
                  <button class="share-button" onclick="sharePost('${postId}')"><i class='bx bxs-share'></i></button>
                  <button class="save-button" onclick="savePost('${postId}')"><i class='bx bxs-save'></i></button>
              </div>
          </div>
          <div class="caption">${postData.title || "No title"}</div>
          <p>${postData.content || "No content available."}</p>
      `;
  
    postsContainer.appendChild(postDiv);
  
    if (userAction === "like") {
      document.getElementById(`like-${postId}`).classList.add("active");
    } else if (userAction === "dislike") {
      document.getElementById(`dislike-${postId}`).classList.add("active");
    }
  }

  
// Handle image loading error
function handleImageError(image) {
  image.src = "default-image.jpg"; // Replace with your default image path
}

// Function to get the user's action on a post
async function getUserAction(postId) {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  const userActionsCollection = collection(db, "userActions");
  const q = query(
    userActionsCollection,
    where("userId", "==", currentUser.uid),
    where("postId", "==", postId)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data().action; // Assuming only one action per user per post
  }

  return null;
}

// Get username
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
const database = getDatabase();

async function getUserName(userId) {
  try {
    const userRef = ref(database, "registrations/" + userId);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.val();
      console.log("User Data:", userData); // Log user data for debugging

      const fullName = `${userData.firstName || ""} ${
        userData.lastName || ""
      }`.trim();
      return fullName || "Anonymous";
    } else {
      console.log("User does not exist.");
      return "Anonymous";
    }
  } catch (error) {
    console.error("Error fetching user name:", error);
    return "Anonymous";
  }
}

// Update post data and UI
async function updatePostData(postId, likesChange = 0, dislikesChange = 0) {
  const postRef = doc(db, "posts", postId);

  try {
    await runTransaction(db, async (transaction) => {
      const postDoc = await transaction.get(postRef);
      if (!postDoc.exists()) {
        throw "Post does not exist!";
      }

      const currentData = postDoc.data();
      const newLikes = Math.max(0, (currentData.likes || 0) + likesChange);
      const newDislikes = Math.max(
        0,
        (currentData.dislikes || 0) + dislikesChange
      );

      transaction.update(postRef, {
        likes: newLikes,
        dislikes: newDislikes,
      });

      // Update the UI
      document.getElementById(
        `like-${postId}`
      ).innerHTML = `${newLikes} <i class="bx bxs-like"></i>`;
      document.getElementById(
        `dislike-${postId}`
      ).innerHTML = `${newDislikes} <i class="bx bxs-dislike"></i>`;
    });
  } catch (error) {
    console.error("Transaction failed: ", error);
  }
}

// Function to like a post
async function likePost(postId) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    alert("Please log in to like this post.");
    return;
  }

  const userAction = await getUserAction(postId);

  if (userAction === "like") {
    alert("You have already liked this post.");
    return;
  }

  if (userAction === "dislike") {
    // Remove dislike action and update UI
    await updatePostData(postId, 1, -1);
    await setDoc(doc(db, "userActions", `${currentUser.uid}_${postId}`), {
      userId: currentUser.uid,
      postId: postId,
      action: "like",
    });
  } else {
    // Increment like count
    await updatePostData(postId, 1, 0);
    await setDoc(doc(db, "userActions", `${currentUser.uid}_${postId}`), {
      userId: currentUser.uid,
      postId: postId,
      action: "like",
    });
  }
}

// Function to dislike a post
async function dislikePost(postId) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    alert("Please log in to dislike this post.");
    return;
  }

  const userAction = await getUserAction(postId);

  if (userAction === "dislike") {
    alert("You have already disliked this post.");
    return;
  }

  if (userAction === "like") {
    // Remove like action and update UI
    await updatePostData(postId, -1, 1);
    await setDoc(doc(db, "userActions", `${currentUser.uid}_${postId}`), {
      userId: currentUser.uid,
      postId: postId,
      action: "dislike",
    });
  } else {
    // Increment dislike count
    await updatePostData(postId, 0, 1);
    await setDoc(doc(db, "userActions", `${currentUser.uid}_${postId}`), {
      userId: currentUser.uid,
      postId: postId,
      action: "dislike",
    });
  }
}

// Function to save a post
function savePost(postId) {
  // Implement save functionality (e.g., download the image)
  const postImage = document.querySelector(`#post-${postId} .post-image`);
  if (postImage) {
    const imageUrl = postImage.src;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `post-${postId}.jpg`;
    link.click();
  }
}

// Function to share a post
function sharePost(postId) {
  const postContent = document.querySelector(
    `#post-${postId} .post-content`
  ).textContent;
  if (navigator.share) {
    navigator
      .share({
        title: "Check out this post!",
        text: postContent,
        url: window.location.href,
      })
      .catch(console.error);
  } else {
    alert("Sharing is not supported in this browser.");
  }
}




// Function to handle logout
async function handleLogout() {
  try {
    await signOut(auth);
    console.log("User signed out.");
    window.location.href = "index.html"; // Redirect to home page
  } catch (error) {
    console.error("Error signing out:", error);
  }
}

// Check authentication state and fetch user posts
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in");
    fetchUserPosts(); // Fetch posts created by the user
  } else {
    console.log("User is signed out");
    document.getElementById("posts-container").innerHTML =
      "Please log in to see your posts.";
  }
});

// Run the function on page load
document.addEventListener("DOMContentLoaded", () => {
  fetchUserPosts(); // Fetch user posts when the page loads
  document
    .getElementById("logout-button")
    .addEventListener("click", handleLogout); // Add logout button event listener
});

window.deletePost = deletePost;
window.editPost = editPost;
window.savePost = savePost;
window.sharePost = sharePost;
window.likePost = likePost;
window.dislikePost = dislikePost;