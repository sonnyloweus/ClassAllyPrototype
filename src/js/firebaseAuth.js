//#################################################################################
//###############################  Variables ######################################
//#################################################################################
let loginError = document.getElementById("loginError");
let singUpError = document.getElementById("singUpError");
let emailStatus = document.getElementById("emailStatus");

//#################################################################################
//#############3#######  Listen for Auth Status Change  ###########################
//#################################################################################
auth.onAuthStateChanged(user => {
    if(user){
        $('.mainBody').css('display', 'block');
        $('.loggedInButtons').css('display', 'block');
        $('.loggedOutButtons').css('display', 'none');
        $('.meetings').css('display', 'block');
        closePops();
        setupInfo(user);
        userId = user.uid;

        db.collection('users').doc(user.uid).get().then(doc => {

            let refToken = `${doc.data().refreshTok}`;
            let email = `${user.email}`;
            email = email.split("@");
            emailStatus.innerHTML = email[0] + "<br> @" + email[1];

            if(refToken == 0){
                $('.authorizeSection').css('display', 'block');
            }else{
                // console.log(refToken);
                // console.log("auto refresh detect");
                refreshToken();
            }
            if ($("#classroomButton").hasClass('activePageButton')){
                drawClassrooms();
            }

        });

    }else{
        $('.mainBody').css('display', 'none');
        $('.loggedInButtons').css('display', 'none');
        $('.loggedOutButtons').css('display', 'block');
        $('.meetings').css('display', 'none');
        access_tokenHtml.innerHTML = 'Zoom Connection:<span class="icon"><i class="fas fa-times-circle"></i></span>';
        userId = 0;
    }
});

//#################################################################################
//################################  Sign Up  ######################################
//#################################################################################
const signupForm = document.getElementById("signup-form");
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get User info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    //sign up the user, might take some time to complete, returns user credential
    const promise = auth.createUserWithEmailAndPassword(email, password).then(cred => {
        return db.collection('users').doc(cred.user.uid).set({
            school: signupForm['signup-school'].value,
            refreshTok: 0,
            classrooms: [],
            students: []
        });
    }).then(() => {
        // console.log(cred.user);
        console.log("User signed up/in");
        //after sign up
        $('.authorizeSection').css('display', 'block');
        singUpError.innerText = "";
        signupForm.reset();
    });

    let errorMessage = 0;
    promise.catch(e => {errorMessage = e.message}).then(() => {
        singUpError.innerHTML = "<br>";
        if(errorMessage == "The email address is badly formatted."){
            errorMessage = "The email address is badly formatted"
        }else if(errorMessage == "Password should be at least 6 characters"){
            errorMessage = "Password should be at least 6 characters"
        }else if(errorMessage == "The email address is already in use by another account."){
            errorMessage = "The email address is already in use by another account."
        }
        singUpError.innerHTML = "<br>" + errorMessage;
    });
});

//#################################################################################
//################################  Log Out  ######################################
//#################################################################################
logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log("User signed out");
        // location.reload();
        //front end stuff
    });
})

//#################################################################################
//################################  Log In  #######################################
//#################################################################################
const loginForm = document.getElementById("login-form");
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get User info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    //sign up the user, might take some time to complete, returns user credential
    const promise = auth.signInWithEmailAndPassword(email, password).then(cred => {
        return db.collection('users').doc(cred.user.uid).get().then(doc => {
            let refToken = `${doc.data().refreshTok}`
            if(refToken == 0){
                $('.authorizeSection').css('display', 'block');
            }else{
                $('.authorizeSection').css('display', 'none');
            }
        });
    }).then(() => {
        // console.log(cred.user);
        console.log("User signed in")
        //after sign up
        loginError.innerText = "";
        loginForm.reset();
    });

    let errorMessage = 0;
    promise.catch(e => {errorMessage = e.message}).then(() => {
        loginError.innerHTML = "<br>";
        if(errorMessage == "There is no user record corresponding to this identifier. The user may have been deleted."){
            errorMessage = "An account associated with the address could not be found"
        }else if(errorMessage == "The password is invalid or the user does not have a password."){
            errorMessage = "Password is incorrect"
        }
        loginError.innerHTML = "<br>" + errorMessage;
    });
});

