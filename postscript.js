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
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc, setDoc, query, where, runTransaction, orderBy } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js';

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

// Function to fetch posts
async function fetchPosts() {
  try {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = ''; // Clear any existing posts
    console.log("Fetching posts...");

    // Use the collection and query functions from Firestore
    const postsCollection = collection(db, "posts");
    const postsQuery = query(postsCollection, orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(postsQuery);
    console.log("Query Snapshot:", querySnapshot);

    if (querySnapshot.empty) {
      console.log("No posts found.");
      postsContainer.innerHTML = '<p>No posts available.</p>';
    } else {
      querySnapshot.forEach((doc) => {
        const postId = doc.id;
        const postData = doc.data();
        console.log("Post Data:", postId, postData);
        renderPost(postId, postData);
      });
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    document.getElementById('posts-container').innerHTML = '<p>Error fetching posts. Check console for details.</p>';
  }
}


//get username
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

// Initialize Firebase Realtime Database
const database = getDatabase();

// Function to get the user's name using their userId
async function getUserName(userId) {
  try {
    const userRef = ref(database, 'registrations/' + userId);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.val();
      console.log('User Data:', userData); // Log user data for debugging

      const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
      return fullName || 'Anonymous';
    } else {
      console.log('User does not exist.');
      return 'Anonymous';
    }
  } catch (error) {
    console.error('Error fetching user name:', error);
    return 'Anonymous';
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

  const userName = await getUserName(postData.userId); // Fetch the user's name using their userId

  postDiv.innerHTML = `
    <div class="displayname">
      <div class="box1">
        <div class="person-icon"><i class='bx bxs-user'></i></div>
        <div class="user-name">${userName || 'Anonymous'}</div>
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



// Function to save a post to the user's saved posts in Firestore   BLOB
async function savePost(postId) {
  const currentUser = auth.currentUser; 
  if (!currentUser) {
      alert('Please log in to save this post.');
      return;
  }

  try {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      if (!postDoc.exists()) {
          alert('Post not found.');
          return;
      }
      const postData = postDoc.data();
      const imageUrl = postData.imageUrl;

      if (!imageUrl) {
          alert('No image URL found for this post.');
          return;
      }

      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `post-${postId}.jpg`; // Specify the name for the downloaded file
      document.body.appendChild(link);
      link.click(); // Trigger the download
      document.body.removeChild(link); // Clean up by removing the link

      // alert('Image download started!');
  } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download the image. Check console for details.');
  }
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


  // post.html nav
  const uploadPostLink = document.getElementById('upload-post-link');
  const loginNav = document.getElementById('auth-link');
  const modal = document.getElementById('loginModal');
  const closeModal = document.querySelector('#loginModal .close');

  uploadPostLink.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default link behavior
    console.log("clicked in post")
    onAuthStateChanged(auth, (user) => {
      if (user) {
        window.location.href = "post.html";
      } else {
        if (modal) {
          modal.style.display = 'flex';
        } else {
          alert('Login is mandatory to Upload Post');
        }
      }
    });
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});


// Expose functions globally
window.likePost = likePost;
window.dislikePost = dislikePost;
window.savePost = savePost;
window.sharePost = sharePost;
