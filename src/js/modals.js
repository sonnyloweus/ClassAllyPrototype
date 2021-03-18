//#################################################################################
//#############################  Html Variables  ##################################
//#################################################################################
let signupModal = document.getElementById("modal-signup");
let loginModal = document.getElementById("modal-login");
let accountModal = document.getElementById("modal-account");
let classroomModal = document.getElementById("modal-classroom");
let studentModal = document.getElementById("modal-students");
let helpModal = document.getElementById("modal-tutorial");
let createMeetingModal = document.getElementById("modal-createMeeting");
let modalId = document.getElementById("modal-id");
let modalAlert = document.getElementById("modal-alert");

let loginButton = document.getElementById("loginButton");
let signupButton = document.getElementById("signupButton"); 
let loginButton1 = document.getElementById("loginButton1");
let signupButton1 = document.getElementById("signupButton1"); 
let addClassroom = document.getElementById("addClassroom"); 
let addStudents = document.getElementById("addStudents"); 
let helpButton = document.getElementById("helpButton"); 

let logoutButton = document.getElementById("logoutButton");
let accountInfoButton = document.getElementById("accountInfoButton");

let accountDetails = document.getElementById("account-details");
let alertText = document.getElementById("alert-Text");

let closeLog = document.getElementById("closeLog");
let closeSign = document.getElementById("closeSign");
let closeAccount = document.getElementById("closeAccount");
let closeRooms = document.getElementById("closeRooms");
let closeStudents = document.getElementById("closeStudents");
let closeTutorial = document.getElementById("closeTutorial");
let closeCreateMeeting = document.getElementById("closeCreateMeeting");
let closeAlert = document.getElementById("closeAlert");

let signupSchool = document.getElementById("signup-school");
// let closeId = document.getElementById("closeId");

//#################################################################################
//###########################  Onclick Functions  #################################
//#################################################################################

loginButton1.onclick = function(){
    closePops();
    loginModal.style.display = "block";
}

signupButton1.onclick = function(){
    closePops();


    db.collection('admin').doc('Info').collection("schools").get().then((snapshot) => {
        let tempList = snapshot.docs;
        tempList.forEach(doc => {
            let tempName = doc.id;
            signupSchool.innerHTML = signupSchool.innerHTML + `
            <option value="`+tempName+`">` + tempName + `</option>
            `;
        });
        signupModal.style.display = "block";
    });
}

loginButton.onclick = function(){
    closePops();
    loginModal.style.display = "block";
}

signupButton.onclick = function(){
    closePops();

    db.collection('admin').doc('Info').collection("schools").get().then((snapshot) => {
        let tempList = snapshot.docs;
        tempList.forEach(doc => {
            let tempName = doc.id;
            signupSchool.innerHTML = signupSchool.innerHTML + `
            <option value="`+tempName+`">` + tempName + `</option>
            `;
        });
        signupModal.style.display = "block";
    });
}

accountInfoButton.onclick = function(){
    closePops();
    accountModal.style.display = "block";
}

helpButton.onclick = function(){
    closePops();
    helpModal.style.display = "block";
}

function createAlert(message){
    alertText.innerText = message;
    modalAlert.style.display = "block";
}

closeLog.onclick = function(){closePops()};
closeSign.onclick = function(){closePops()};
closeAccount.onclick = function(){closePops()};
closeRooms.onclick = function(){closePops()};
closeStudents.onclick = function(){closePops()};
closeTutorial.onclick = function(){closePops()};
closeCreateMeeting.onclick = function(){closePops()};
closeAlert.onclick = function(){closePops()};

// closeId.onclick = function(){closePops()};

//#################################################################################
//###########################  Utility Functions  #################################
//#################################################################################
function closePops(){
    loginModal.style.display = "none";
    signupModal.style.display = "none";
    accountModal.style.display = "none";
    classroomModal.style.display = "none";
    studentModal.style.display = "none";
    helpModal.style.display = "none";
    createMeetingModal.style.display = "none";
    modalId.style.display = "none";
    modalAlert.style.display = "none";
}

function setupInfo(user){
    if(user){
        // account info
        db.collection('users').doc(user.uid).get().then(doc => {
            const info = `
                <h3> Name: ${doc.data().name} </h3>
                <h3> Email: ${user.email} </h3>
                <h3> School: ${doc.data().school} </h3>
            `;
            accountDetails.innerHTML = info;
        })
    
    }else{
        accountDetails.innerHTML = "Not Logged In";
    }
}

 