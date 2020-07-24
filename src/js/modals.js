//#################################################################################
//#############################  Html Variables  ##################################
//#################################################################################
let signupModal = document.getElementById("modal-signup");
let loginModal = document.getElementById("modal-login");
let accountModal = document.getElementById("modal-account");

let loginButton = document.getElementById("loginButton");
let signupButton = document.getElementById("signupButton"); 

let logoutButton = document.getElementById("logoutButton");
let accountInfoButton = document.getElementById("accountInfoButton");

let accountDetails = document.getElementById("account-details");

let closeLog = document.getElementById("closeLog");
let closeSign = document.getElementById("closeSign");
let closeAccount = document.getElementById("closeAccount");

//#################################################################################
//###########################  Onclick Functions  #################################
//#################################################################################

loginButton.onclick = function(){
    loginModal.style.display = "block";
    signupModal.style.display = "none";
    accountModal.style.display = "none";
}

signupButton.onclick = function(){
    loginModal.style.display = "none";
    signupModal.style.display = "block";
    accountModal.style.display = "none";
}

accountInfoButton.onclick = function(){
    accountModal.style.display = "block";
    loginModal.style.display = "none";
    signupModal.style.display = "none";
}

closeLog.onclick = function(){closePops()};
closeSign.onclick = function(){closePops()};
closeAccount.onclick = function(){closePops()};

//#################################################################################
//###########################  Utility Functions  #################################
//#################################################################################
function closePops(){
    loginModal.style.display = "none";
    signupModal.style.display = "none";
    accountModal.style.display = "none";
}

function setupInfo(user){
    if(user){
        // account info
        db.collection('users').doc(user.uid).get().then(doc => {
            const info = `
                <h3> Email: ${user.email} </h3>
                <h3> School: ${doc.data().school} </h3>
            `;
            accountDetails.innerHTML = info;
        })
    
    }else{
        accountDetails.innerHTML = "Not Logged In";
    }
}

 