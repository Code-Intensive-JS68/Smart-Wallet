import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
    // import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
          
    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyAhQb16UMv471Z4PPB5UedpdecQ3qYEChM",
        authDomain: "smartwallet-4f238.firebaseapp.com",
        projectId: "smartwallet-4f238",
        storageBucket: "smartwallet-4f238.appspot.com",
        messagingSenderId: "906540826080",
        appId: "1:906540826080:web:55fcafdaa8c32900afff85"
        };
          
        // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const loginUser = document.getElementById('loginUser');
    //Get current signed in user
    onAuthStateChanged(auth, (user) => {
    if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        const email = user.email;
        console.log(uid);
        loginUser.innerHTML = `${email}`
        } 
    });
       
    let logoutBtn = document.getElementById("logout");
    logoutBtn.addEventListener('click', logout);

    //signOut fucntion
    function logout() {
      signOut(auth).then(() => {
        location.href = "login.html";
     }).catch((error) => {
    // An error happened.
     alert(error); 
      });
    }

    





