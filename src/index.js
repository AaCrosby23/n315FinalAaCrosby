import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { changeRoute, getData, updateCartCounter } from "../dist/services/services.js";

var logInOrSignUp = "login";

const firebaseApp = initializeApp({
        apiKey: "AIzaSyBYWWWY4yYgU1zwy9kwbcN8FR16B7Xp6Bo",
        authDomain: "n315-aacrosby.firebaseapp.com",
        projectId: "n315-aacrosby",
        storageBucket: "n315-aacrosby.appspot.com",
        messagingSenderId: "887192778573",
        appId: "1:887192778573:web:9def8582c94c4442842904",
        measurementId: "G-5X95E2LN8N"
      });

const auth = getAuth(firebaseApp);

// detect auth state

onAuthStateChanged(auth, (user) => {
    if (user != null) 
    {
        console.log("user logged in");
        console.log("authstate: ", user);
    } 
    else 
    {
        console.log("no user");
    }
});

function initListeners() {
    
    $(".loginToggle").on("click", function () {
        logInOrSignUp = "logIn";
        $(".loginToggle").addClass("activeToggle");
        $(".signUpToggle").removeClass("activeToggle");
        $("#firstName").addClass("hide");
        $("#lastName").addClass("hide");
        $(".submitButton").html("SIGN IN");
    })

    $(".signUpToggle").on("click", function () {
        logInOrSignUp = "signUp";
        $(".signUpToggle").addClass("activeToggle");
        $(".loginToggle").removeClass("activeToggle");
        $("#firstName").removeClass("hide");
        $("#lastName").removeClass("hide");
        $(".submitButton").html("CREATE AN ACCOUNT");
    })

    $(".accountButton").on("click", function () {
        if (auth.currentUser)
        {
            $(".loggedInModal").toggleClass("hide");
        }
        else
        {
            $(".loginModal").toggleClass("hide");
        }
    })

    $(".closeModal").on("click", function () {
        $(".loginModal").addClass("hide");
        $(".loggedInModal").addClass("hide");
    });

    $(".submitButton").on("click", function () {
        console.log("clicked");
        accountHandler();
    })

    $(".cartButton").on("click", function () {
        window.location.hash = "cart";
    })

    $(".logoutButton").on("click", function () {
        auth.signOut();
        $(".loginModal").addClass("hide");
        $(".loggedInModal").addClass("hide");
    })

    window.addEventListener("hashchange", changeRoute);
}

export function accountHandler() {

    // inputs
    let emailAddress = $("#email").val();
    let firstName = $("#firstName").val();
    let lastName = $("#lastName").val();
    let password = $("#password").val();

    if (logInOrSignUp === 'signUp')
    {
        createUserWithEmailAndPassword(auth, emailAddress, password)
        .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;

        updateProfile(auth.currentUser, {
            displayName: firstName
        }).catch((error) => {
            console.log(error);
        })

        console.log("sign up username: " + user.displayName);
        $(".loggedInModal h1").html(`Hello, ${user.displayName}`);
        $(".loggedInModal").removeClass("hide");
        // ...
        })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
        // ..
        });
    }
    else if (logInOrSignUp === 'login')
    {
        signInWithEmailAndPassword(auth, emailAddress, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("log in username: " + user.displayName);
            $(".loggedInModal h1").html(`Hello, ${user.displayName}`);
            $(".loggedInModal").removeClass("hide");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
    }
}

$(document).ready(function () {
    initListeners();
    getData();
    changeRoute();
    updateCartCounter();
});