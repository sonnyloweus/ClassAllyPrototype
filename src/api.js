// Bring in environment secrets through dotenv
// npm install dotenv
let dotenv = require('dotenv');
const result = dotenv.config();
let access_token = 0;

// npm i http
var http = require("https");

// var options = {
//     "method": "POST",
//     "hostname": "zoom.us",
//     "port": null,
//     "path": "/oauth/authorize?response_type=code&client_id=36Ty8z1S3G1jhNbnlhsYw&redirect_uri=https://marketplace.zoom.us/docs/oauth/callback/success/api/v2/zoom/complete-oauth",
//     "headers": {
//     }
// };

// var req = http.request(options, function (res) {
//     var chunks = [];

//     res.on("data", function (chunk) {
//         chunks.push(chunk);
//     });

//     res.on("end", function () {
//         var body = Buffer.concat(chunks);
//         console.log(body.toString());
//     });

//     console.log("end of getting authorization code")
// });

// req.end();

let authURL = "https://zoom.us/oauth/authorize?response_type=code&client_id=36Ty8z1S3G1jhNbnlhsYw&redirect_uri=https://marketplace.zoom.us/docs/oauth/callback/success/api/v2/zoom/complete-oauth"
let authorizeButton = document.getElementById("authorize");
authorizeButton.onclick = function(){
    window.open(
        authURL, "window name",
        "height=200,width=200,modal=yes,alwaysRaised=yes");
}

var options = {
    "method": "POST",
    "hostname": "zoom.us",
    "port": null,
    "path": "/oauth/token?grant_type=authorization_code&code=" + "VR1GwcB9d2_1lKrjtU8QAiU77LTC2A2iA" + "&redirect_uri=https://marketplace.zoom.us/docs/oauth/callback/success/api/v2/zoom/complete-oauth",
    "headers": {
        "authorization": "Basic MzZUeTh6MVMzRzFqaE5ibmxoc1l3OlVWVkZON0Ixa0wyOHFzeWkwMHk0dFpNVEFYaGxKNlYy"
    }
};

var acc = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString())
        body = JSON.parse(body)
        console.log(body.access_token);
        access_token = body.access_token;

        //  /v2/users/sonny.lowe23@bcp.org/meetings?page_number=1&page_size=30&type=live

        //  /v2/im/chat/messages

        options = {
            "method": "GET",
            "hostname": "api.zoom.us",
            "port": null,
            "path": "/v2/im/chat/messages",
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

        api.write(JSON.stringify({message: 'Hello World!'}));
        api.end();

    });
    console.log("end of getting access token")
});

acc.end();



//#################################################################################
//#################################################################################
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