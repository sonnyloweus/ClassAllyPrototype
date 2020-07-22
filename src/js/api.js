// Bring in environment secrets through dotenv
// npm install dotenv
let dotenv = require('dotenv');
const result = dotenv.config();
let access_token = 0;
let refresh_token = 0;
let authCode = 0;

// npm i http
var http = require("https");


function runAPI(){
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
            console.log(body.access_token);
            access_token = body.access_token;
            refresh_token = body.refresh_token;

            //  /v2/users/sonny.lowe23@bcp.org/meetings?page_number=1&page_size=30&type=live

            //  /v2/im/chat/messages

            options = {
                "method": "GET",
                "hostname": "api.zoom.us",
                "port": null,
                "path": "/v2/users/sonny.lowe23@bcp.org/meetings?page_number=1&page_size=30&type=live",
                "headers": {
                    "content-type": "application/json",
                    "authorization": "Bearer " + access_token
                }
            };
            
            
            var api = http.request(options, function (res) {
                var chunks = [];
            
                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });
            
                res.on("end", function () {
                    var body = Buffer.concat(chunks);
                    console.log(body.toString());
                });
            });

            api.end();

        });
        console.log("end of getting access token")
    });

    acc.end();
}



//#################################################################################
//#################################################################################


let authURL = "https://zoom.us/oauth/authorize?response_type=code&client_id=36Ty8z1S3G1jhNbnlhsYw&redirect_uri=https://marketplace.zoom.us/docs/oauth/callback/success/api/v2/zoom/complete-oauth"

let authorizeButton = document.getElementById("authorize");
authorizeButton.onclick = function(){
    let popup = window.open(
        authURL, "window name",
        "height=600,width=800,modal=yes,alwaysRaised=yes");

    let checkCode = setInterval(function(){
        var url = popup.location.href;
        let params = (new URL(url)).searchParams;
        authCode = params.get('code')

        if(authCode != null){
            popup.close();
            clearInterval(checkCode);
            console.log(authCode);
        }
    },500);

    let hiddenButton = document.querySelector(".startAPI");

    let checkClosed = setInterval(function() {
        if (popup.closed) {
            clearInterval(checkCode);
            clearInterval(checkClosed);

            if(authCode != null){
                hiddenButton.style.display = "block";
                console.log(authCode);
            }

        }
    }, 1000);
}

let beginAPI = document.getElementById("begin");
beginAPI.onclick = function(){
    runAPI();
}



// Use the request module to make HTTP requests from Node
// npm i require
// const request = require('request');
// Run the express app
// npm i express
// const express = require('express');
// const app = express();

// console.log("app.get function waiting");

// app.get('/', (req, res) => {

// })

// app.listen(80, () => console.log(`Zoom Hello World app listening at PORT: 80`))
