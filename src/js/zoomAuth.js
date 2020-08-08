//#################################################################################
//###############################  Variables ######################################
//#################################################################################

// Bring in environment secrets through dotenv
// npm install dotenv
let dotenv = require('dotenv');
const result = dotenv.config();
let access_token = 0;
let authCode = 0;
let userId = 0;
let refToken = 0;

// npm i http
var http = require("https");
const { app } = require('electron');

let access_tokenHtml = document.getElementById("access_token");

//#################################################################################
//#####################  Refreshing the Access Token  #############################
//#################################################################################
function refreshToken() {
    console.log("refreshing token")
    db.collection('users').doc(userId).get().then(doc => {
        refToken = `${doc.data().refreshTok}`
    }).then(() => {
        var options = {
            "method": "POST",
            "hostname": "zoom.us",
            "port": null,
            "path": "/oauth/token?grant_type=refresh_token&refresh_token=" + refToken,
            "headers": { 
                "authorization": "Basic " + process.env.BASE_ENCODE
            }
        };

        let ref = http.request(options, function (res) {

            var chunks = [];
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
    
            res.on("end", function () {
                var body = Buffer.concat(chunks);
                // console.log(body.toString())
                body = JSON.parse(body)
                // console.log(body.access_token);
    
                db.collection('users').doc(userId).update({
                    refreshTok: body.refresh_token
                }).then(() => {
                    authCode = null;
                    access_token = body.access_token;
                    access_tokenHtml.innerHTML = 'Zoom Connection:<span class="icon"><i class="fas fa-check-square"></i></span>';

                        getMeetings["headers"]["authorization"] = "Bearer " + access_token;
                        callAPI(getMeetings, "getMeetings");
                });

            });
            console.log("end of refreshing access token")
        });
        ref.end();
    });

}


//#################################################################################
//####################  Getting Access Token First Time ###########################
//#################################################################################
//x5_FEfeYQYOYKvJQbEflSA
//Xsfzed4uuwEjyOhKFiWogfwNcbWhYaSY
//eDVfRkVmZVlRWU9ZS3ZKUWJFZmxTQTpYc2Z6ZWQ0dXV3RWp5T2hLRmlXb2dmd05jYldoWWFTWQ==
//36Ty8z1S3G1jhNbnlhsYw
//UVVFN7B1kL28qsyi00y4tZMTAXhlJ6V2
//MzZUeTh6MVMzRzFqaE5ibmxoc1l3OlVWVkZON0Ixa0wyOHFzeWkwMHk0dFpNVEFYaGxKNlYy

function getToken(tempAcc) {
    console.log("getting access token")
    console.log(tempAcc);
    var options = {
        "method": "POST",
        "hostname": "zoom.us",
        "port": null,
        "path": "/oauth/token?grant_type=authorization_code&code="+tempAcc+"&redirect_uri=" + process.env.REDIRECT_URL,
        "headers": {
            "authorization": "Basic " + process.env.BASE_ENCODE
        }
    };
    let acc = http.request(options, function (res) {
        var chunks = [];
        
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
        res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString())
            body = JSON.parse(body)

            access_token = body.access_token;
            
            db.collection('users').doc(userId).update({
                refreshTok: body.refresh_token
            }).then(() => {
                authCode = null;
                console.log("end of getting access token")

                access_tokenHtml.innerHTML = 'Zoom Connection:<span class="icon"><i class="fas fa-check-square"></i></span>';
                $(".meetings").css('display', 'block');
                refreshToken();
            });

        });
    });
    acc.end();
}

//#################################################################################
//######################  Getting Authorization Code ##############################
//#################################################################################

let userIdString = "userId=" + userId;
let authURL = "https://zoom.us/oauth/authorize?response_type=code&client_id=" + process.env.CLIENT_ID + "&redirect_uri="  + process.env.REDIRECT_URL;

let authorizeButton = document.getElementById("authorize");
authorizeButton.onclick = function () {
    // let popup = window.open(
    //     authURL, "Zoom Authentication",
    //     "height=600,width=800,modal=yes,alwaysRaised=yes,frame=true");
    // console.log();

    userIdString = "userId=" + userId;
    authURL = "https://zoom.us/oauth/authorize?response_type=code&client_id=" + process.env.CLIENT_ID + "&redirect_uri="  + process.env.REDIRECT_URL;

    let accountId = document.getElementById("account-id");
    modalId.style.display = "block";
    accountId.innerHTML = `
        <h3> User Id: ` + userId +  `</h3><br>
        <p>Follow instructions on browser before clicking aything.</p><br>
        <button onclick="logout()" role="button" class="button is-info is-outlined" data-target="modal-logout" id="authLogoutButton">Log Out</button>
    `;
    opn(authURL);

    // let checkCode = setInterval(function () {
    //     var url = popup.location.href;
    //     let params = (new URL(url)).searchParams;
    //     authCode = params.get('code')
    //     // console.log(url);
    //     if (authCode != null) {
    //         popup.close();
    //         clearInterval(checkCode);
    //     }
    // }, 500);

    // let checkClosed = setInterval(function () {
    //     if (popup.closed) {
    //         clearInterval(checkCode);
    //         clearInterval(checkClosed);

    //         if (authCode != null) {
    //             console.log(authCode);
    //             console.log("auth code achieved");
    //             $('.authorizeSection').css('display', 'none');
    //             getToken();
    //         }

    //     }
    // }, 1000);
}