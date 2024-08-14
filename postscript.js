// document.addEventListener("DOMContentLoaded", function() {
//   const menuIcon = document.querySelector('.menu-icon');
//   const menuItems = document.querySelector('.menu-items');

//   menuIcon.addEventListener('click', function() {
//     menuItems.style.display = menuItems.style.display === 'flex' ? 'none' : 'flex';
//   });
// });

// Togle Nav Menu

document.addEventListener("DOMContentLoaded", function() {
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');

  // Show the menu when the grid icon is clicked
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.add('show-menu');
    });
  }

  // Hide the menu when the close icon is clicked
  if (navClose) {
    navClose.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
    });
  }

  // Hide the menu when a link is clicked
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
    });
  });
});



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



// Check authentication state on page load
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
      profileNav.style.display =  'none';
  }
});



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

  // Get the post data from Firestore
  getDoc(doc(db, "posts", postId))
    .then((docSnapshot) => {
      if (docSnapshot.exists()) {
        const postData = docSnapshot.data();
        const shareData = {
          title: postData.title || 'Check out this post!',
          text: postData.content || '',
          url: `${window.location.origin}/postshow.html?postId=${postId}` // URL to your post page
        };

        if (navigator.share) {
          navigator.share(shareData)
            .then(() => console.log('Post shared successfully!'))
            .catch((error) => console.log('Error sharing post:', error));
        } else {
          alert('Sharing is not supported in your browser.');
        }
      } else {
        console.log('Post does not exist.');
      }
    })
    .catch((error) => {
      console.error('Error getting post data:', error);
    });
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
// Fetch posts or a specific post based on the URL parameter
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('postId'); // Get the postId from the URL if present

  if (postId) {
    // If a specific postId is provided, fetch and display that post only
    try {
      const docSnapshot = await getDoc(doc(db, "posts", postId));
      if (docSnapshot.exists()) {
        const postData = docSnapshot.data();
        document.getElementById('posts-container').innerHTML = ''; // Clear the container
        await renderPost(postId, postData); // Render the specific post
      } else {
        document.getElementById('posts-container').innerHTML = '<p>No post found.</p>';
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      document.getElementById('posts-container').innerHTML = '<p>Error loading post. Check console for details.</p>';
    }
  } else {
    // If no postId is provided, fetch and display all posts
    fetchPosts(); // Fetch and display all posts
  }
});


// Expose functions globally
window.likePost = likePost;
window.dislikePost = dislikePost;
window.savePost = savePost;
window.sharePost = sharePost;
