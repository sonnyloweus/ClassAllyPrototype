//#################################################################################
//###############################  Variables ######################################
//#################################################################################
let loginError = document.getElementById("loginError");
let singUpError = document.getElementById("singUpError");
let emailStatus = document.getElementById("emailStatus");
let nameStatus = document.getElementById("nameStatus");
//#################################################################################
//#############3#######  Listen for Auth Status Change  ###########################
//#################################################################################
auth.onAuthStateChanged(user => {
    if(user){
        access_tokenHtml.innerHTML = 'Connection:<span class="icon"><i class="fas fa-check-square"></i></span>';

        $('.mainBody').css('display', 'block');
        $('.loggedInButtons').css('display', 'block');
        $('#joinOrLog').css('display', 'none');
        $('.loggedOutButtons').css('display', 'none');
        $('.meetings').css('display', 'block');
        closePops();
        setupInfo(user);
        userId = user.uid;
        userEmail = user.email;
        // console.log(userEmail);

        db.collection('users').doc(user.uid).get().then(doc => {

            userName = `${doc.data().name}`;
            let refToken = `${doc.data().refreshTok}`;
            let email = `${user.email}`;
            let tempacc = `${doc.data().accessCode}`
            email = email.split("@");
            emailStatus.innerHTML = email[0] + " @...";
            nameStatus.innerHTML = userName;

            // if(refToken == 0){
            //     if(tempacc != 0){
            //         // console.log(tempacc);
            //         $('.authorizeSection').css('display', 'none');
            //         getToken(tempacc);
            //     }else{
            //         $(".meetings").css('display', 'none');
            //         $('.authorizeSection').css('display', 'block');
            //     }
            // }else{
                // console.log(refToken);
                // console.log("auto refresh detect");
                $(".meetings").css('display', 'block');
                document.getElementById("meetings").innerHTML = `
                    <h1 id="meetingsTitle">Schedule</h1>

                    <div id="slider" class="slider">
                
                    <div id="AddSlides" class="slides">
                
                    </div>
                        <a href="#slide" onclick='slide(this)'><span class="icon"><i class="fas fa-arrow-left"></i></span></a>
                        <!-- <a href="#slide-1" onclick='slide(this)'>1</a> -->
                        <!-- <a href="#slide-2" onclick='slide(this)'>2</a> -->
                        <a href="#slide" onclick='slide(this)'><span class="icon"><i class="fas fa-arrow-right"></i></span></a>
                    </div>
                `;
                // console.log("calling refresh token");
                // refreshToken();
            // }
            if ($("#classroomButton").hasClass('activePageButton')){
                $("#currentPage").load("templates/classroomPage.html");
            }else if($("#studentButton").hasClass('activePageButton')){
                $("#currentPage").load("templates/studentsPage.html");
            }

        });

    }else{
        $('.mainBody').css('display', 'none');
        $('.loggedInButtons').css('display', 'none');
        $('.loggedOutButtons').css('display', 'block');
        $('#joinOrLog').css('display', 'block');
        $('.meetings').css('display', 'none');
        access_tokenHtml.innerHTML = 'Connection:<span class="icon"><i class="fas fa-times-circle"></i></span>';
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
    const code = signupForm['signup-code'].value;

    if(code == "000001"){
        //sign up the user, might take some time to complete, returns user credential
        const promise = auth.createUserWithEmailAndPassword(email, password).then(cred => {
            return db.collection('users').doc(cred.user.uid).set({
                name: signupForm['signup-name'].value,
                school: signupForm['signup-school'].value,
                refreshTok: 0,
                classrooms: [],
                students: [],
                accessCode: 0
            });
        }).then(() => {
            // console.log(cred.user);
            console.log("User signed up/in");
            //after sign up
            // $('.authorizeSection').css('display', 'block');
            singUpError.innerHTML = "";
            signupForm.reset();
        });

        let errorMessage = 0;
        promise.catch(e => {errorMessage = e.message}).then(() => {
            // console.log(errorMessage);
            singUpError.innerHTML = "<br>";
            if(errorMessage == "The email address is badly formatted."){
                errorMessage = "The email address is poorly formatted"
            }else if(errorMessage == "Password should be at least 6 characters"){
                errorMessage = "Password should be at least 6 characters"
            }else if(errorMessage == "The email address is already in use by another account."){
                errorMessage = "The email address is already in use by another account."
            } 
            if(errorMessage == 0){
                singUpError.innerHTML = "";
            }else{
                singUpError.innerHTML = "<br>" + errorMessage;
            }
        });
    }else{
        singUpError.innerHTML = "<br>" + "Your access code is incorrect.";
    }
});

//#################################################################################
//################################  Log Out  ######################################
//#################################################################################
logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log("User signed out");
        clearMeetings();
        location.reload();
        //front end stuff
    });
})

function logout(){
    auth.signOut().then(() => {
        console.log("User signed out");
        modalId.style.display = "none";
        clearMeetings();
        // app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
        //front end stuff
    });
}

function clearMeetings(){
    let meetings = document.getElementById("meetings");
    meetings.innerHTML = `
        <h1 id="meetingsTitle">Schedule</h1>

        <div id="slider" class="slider">

        <div id="AddSlides" class="slides">

        </div>
        <a href="#slide" onclick='slide(this)'><span class="icon"><i class="fas fa-arrow-left"></i></span></a>
        <!-- <a href="#slide-1" onclick='slide(this)'>1</a> -->
        <!-- <a href="#slide-2" onclick='slide(this)'>2</a> -->
        <a href="#slide" onclick='slide(this)'><span class="icon"><i class="fas fa-arrow-right"></i></span></a>
        </div>
    `;
}

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
            // let refToken = `${doc.data().refreshTok}`
            // let tempacc = `${doc.data().accessCode}`
            // if(refToken == 0){
            //     if(tempacc == 0){
            //         $('.authorizeSection').css('display', 'none');
            //         // $('.authorizeSection').css('display', 'block');
            //     }else{
            //         $('.authorizeSection').css('display', 'none');
            //     }
            // }else{
            //     $('.authorizeSection').css('display', 'none');
            // }
        });
    }).then(() => {
        // console.log(cred.user);
        console.log("User signed in")
        //after sign up
        loginError.innerHTML = "";
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

        if(errorMessage == 0){
            loginError.innerText = "";
        }else{
            loginError.innerHTML = "<br>" + errorMessage;
        }
    });
});

