// listen for Auth status
auth.onAuthStateChanged(user => {
    if(user){
        $('.mainBody').css('display', 'block')
        $('.navbar-end').css('display', 'block')
        closePops();
        setupInfo(user);
    }else{
        $('.mainBody').css('display', 'none')
        $('.navbar-end').css('display', 'none')
    }
})

//signup
const signupForm = document.getElementById("signup-form");
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get User info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    //sign up the user, might take some time to complete, returns user credential
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        return db.collection('users').doc(cred.user.uid).set({
            school: signupForm['signup-school'].value
        });
    }).then(() => {
        // console.log(cred.user);
        console.log("User signed up/in")
        //after sign up
        signupForm.reset();
    });

});

//logout
logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log("User signed out");
        //front end stuff
    });
})

//logIn
const loginForm = document.getElementById("login-form");
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get User info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    //sign up the user, might take some time to complete, returns user credential
    auth.signInWithEmailAndPassword(email, password).then(cred => {
        // console.log(cred.user);
        console.log("User signed in")
        //after sign up
        loginForm.reset();
    });

});

