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
let refreshTok = 0;

// npm i http
var http = require("https");

let access_tokenHtml = document.getElementById("access_token");

//#################################################################################
//#####################  Refreshing the Access Token  #############################
//#################################################################################
function refreshToken() {
    console.log("refreshing token")
    db.collection('users').doc(userId).get().then(doc => {
        refreshTok = `${doc.data().refreshTok}`
    }).then(() => {
        var options = {
            "method": "POST",
            "hostname": "zoom.us",
            "port": null,
            "path": "/oauth/token?grant_type=refresh_token&refresh_token=" + refreshTok,
            "headers": { 
                "authorization": "Basic " + process.env.BASE_ENCODE
            }
        };
    
        var ref = http.request(options, function (res) {
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
                    access_tokenHtml.innerText = "Authorization code: Valid";
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

function getToken() {
    console.log("getting access token")

    var options = {
        "method": "POST",
        "hostname": "zoom.us",
        "port": null,
        "path": "/oauth/token?grant_type=authorization_code&code=" + authCode + "&redirect_uri=https://marketplace.zoom.us/docs/oauth/callback/success/api/v2/zoom/complete-oauth",
        "headers": {
            "authorization": "Basic " + process.env.BASE_ENCODE
        }
    };

    var acc = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            // console.log(body.toString())
            body = JSON.parse(body)
            // console.log(body.access_token);

            access_token = body.access_token;

            db.collection('users').doc(userId).update({
                refreshTok: body.refresh_token
            }).then(() => {
                authCode = null;
                console.log("end of getting access token")

                access_tokenHtml.innerText = "Authorization code: Valid";
                refreshToken();
            });

        });
    });

    acc.end();
}

//#################################################################################
//######################  Getting Authorization Code ##############################
//#################################################################################

let authURL = "https://zoom.us/oauth/authorize?response_type=code&client_id=" + process.env.CLIENT_ID + "&redirect_uri=https://marketplace.zoom.us/docs/oauth/callback/success/api/v2/zoom/complete-oauth"

let authorizeButton = document.getElementById("authorize");
authorizeButton.onclick = function () {
    let popup = window.open(
        authURL, "Zoom Authentication",
        "height=600,width=800,modal=yes,alwaysRaised=yes");
    console.log(authURL);

    let checkCode = setInterval(function () {
        var url = popup.location.href;
        let params = (new URL(url)).searchParams;
        authCode = params.get('code')

        if (authCode != null) {
            popup.close();
            clearInterval(checkCode);
        }
    }, 500);

    let checkClosed = setInterval(function () {
        if (popup.closed) {
            clearInterval(checkCode);
            clearInterval(checkClosed);

            if (authCode != null) {
                // console.log(authCode);
                console.log("auth code achieved");
                $('.authorizeSection').css('display', 'none');
                getToken();
            }

        }
    }, 1000);
}