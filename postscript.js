// document.addEventListener("DOMContentLoaded", function() {
//   const menuIcon = document.querySelector('.menu-icon');
//   const menuItems = document.querySelector('.menu-items');

//   menuIcon.addEventListener('click', function() {
//     menuItems.style.display = menuItems.style.display === 'flex' ? 'none' : 'flex';
//   });
// });


// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js';
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc, setDoc, query, where, runTransaction } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js';

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

// Fetch posts from Firestore and render them
async function fetchPosts() {
  try {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = ''; // Clear any existing posts

    const postsCollection = collection(db, "posts");
    const querySnapshot = await getDocs(postsCollection);

    if (querySnapshot.empty) {
      postsContainer.innerHTML = '<p>No posts available.</p>';
    } else {
      for (const docSnapshot of querySnapshot.docs) {
        const postId = docSnapshot.id;
        const postData = docSnapshot.data();
        await renderPost(postId, postData);
      }
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    document.getElementById('posts-container').innerHTML = '<p>Error fetching posts. Check console for details.</p>';
  }
}

// Render a single post
async function renderPost(postId, postData) {
  const postsContainer = document.getElementById('posts-container');
  const postDiv = document.createElement('div');
  postDiv.className = 'post';

  const currentUser = auth.currentUser;
  let userAction = null;

  if (currentUser) {
    userAction = await getUserAction(postId);
  }

  postDiv.innerHTML = `
    <div class="displayname">
      <div class="box1">
        <div class="person-icon"><i class='bx bxs-user'></i></div>
        <div class="user-name">${postData.email || 'Anonymous'}</div>
      </div>
      <div class="menu-icon"><i class='bx bx-dots-horizontal-rounded'></i></div>
    </div>
    <div class="post-content">
      <img src="${postData.imageUrl || 'default-image.jpg'}" alt="Post Image" class="post-image" onerror="handleImageError(this)">
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
    <div class="caption">${postData.title || 'No title'}</div>
    <p>${postData.content || 'No content available.'}</p>
  `;

  // Append postDiv to the container
  postsContainer.appendChild(postDiv);

  // Update button styles based on user action
  if (userAction === 'like') {
    document.getElementById(`like-${postId}`).classList.add('active');
  } else if (userAction === 'dislike') {
    document.getElementById(`dislike-${postId}`).classList.add('active');
  }
}

// Handle image loading error
function handleImageError(image) {
  image.src = 'default-image.jpg'; // Replace with your default image path
}

// Function to get the user's action on a post
async function getUserAction(postId) {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  const userActionsCollection = collection(db, 'userActions');
  const q = query(userActionsCollection, where('userId', '==', currentUser.uid), where('postId', '==', postId));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data().action; // Assuming only one action per user per post
  }

  return null;
}

// Update post data and UI
async function updatePostData(postId, likesChange = 0, dislikesChange = 0) {
  const postRef = doc(db, 'posts', postId);

  try {
    await runTransaction(db, async (transaction) => {
      const postDoc = await transaction.get(postRef);
      if (!postDoc.exists()) {
        throw "Post does not exist!";
      }

      const currentData = postDoc.data();
      const newLikes = Math.max(0, (currentData.likes || 0) + likesChange);
      const newDislikes = Math.max(0, (currentData.dislikes || 0) + dislikesChange);

      transaction.update(postRef, {
        likes: newLikes,
        dislikes: newDislikes
      });

      // Update the UI
      document.getElementById(`like-${postId}`).innerHTML = `${newLikes} <i class="bx bxs-like"></i>`;
      document.getElementById(`dislike-${postId}`).innerHTML = `${newDislikes} <i class="bx bxs-dislike"></i>`;
    });
  } catch (error) {
    console.error("Transaction failed: ", error);
  }
}

// Function to like a post
async function likePost(postId) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    alert('Please log in to like this post.');
    return;
  }

  const userAction = await getUserAction(postId);

  if (userAction === 'like') {
    alert('You have already liked this post.');
    return;
  }

  if (userAction === 'dislike') {
    // Remove dislike action and update UI
    await updatePostData(postId, 1, -1);
    await setDoc(doc(db, 'userActions', `${currentUser.uid}_${postId}`), {
      userId: currentUser.uid,
      postId: postId,
      action: 'like'
    });
  } else {
    // Increment like count
    await updatePostData(postId, 1, 0);
    await setDoc(doc(db, 'userActions', `${currentUser.uid}_${postId}`), {
      userId: currentUser.uid,
      postId: postId,
      action: 'like'
    });
  }
}

// Function to dislike a post
async function dislikePost(postId) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    alert('Please log in to dislike this post.');
    return;
  }

  const userAction = await getUserAction(postId);

  if (userAction === 'dislike') {
    alert('You have already disliked this post.');
    return;
  }

  if (userAction === 'like') {
    // Remove like action and update UI
    await updatePostData(postId, -1, 1);
    await setDoc(doc(db, 'userActions', `${currentUser.uid}_${postId}`), {
      userId: currentUser.uid,
      postId: postId,
      action: 'dislike'
    });
  } else {
    // Increment dislike count
    await updatePostData(postId, 0, 1);
    await setDoc(doc(db, 'userActions', `${currentUser.uid}_${postId}`), {
      userId: currentUser.uid,
      postId: postId,
      action: 'dislike'
    });
  }
}

// Function to save a post
function savePost(postId) {
  // Implement your save logic here
  alert('Post saved successfully!');
}

// Function to share a post
function sharePost(postId) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    alert('Please log in to share this post.');
    return;
  }

  alert('Post shared successfully!');
}


// Check authentication state on page load
onAuthStateChanged(auth, (user) => {
  const loginNav = document.getElementById('login-nav');
  const logoutNav = document.getElementById('logout-nav');

  if (user) {
      console.log('User is signed in');
      loginNav.style.display = 'none';
      logoutNav.style.display = 'block';

      if (window.location.pathname === "/login.html" || window.location.pathname === "/") {
          window.location.href = "postshow.html"; // Redirect authenticated users away from the login page
      }
  } 
  // else {
  //     console.log('User is signed out');
  //     loginNav.style.display = 'block';
  //     logoutNav.style.display = 'none';

  //     if (window.location.pathname !== "/login.html") {
  //         window.location.href = "postshow.html"; // Redirect unauthenticated users to the login page
  //     }
  // }
});

// Logout functionality
document.getElementById('logout')?.addEventListener('click', async () => {
  try {
      await signOut(auth);
      alert('Successfully logged out.');
      window.location.href = 'index.html'; // Redirect to home page after logout
  } catch (error) {
      console.error('Error during logout:', error);
      alert('Failed to log out.');
  }
});

// Run the function on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchPosts(); // Fetch and display posts
});

// Expose functions globally
window.likePost = likePost;
window.dislikePost = dislikePost;
window.savePost = savePost;
window.sharePost = sharePost;