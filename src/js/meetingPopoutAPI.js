//#################################################################################
//#############################  API Variables  ###################################
//#################################################################################
// var endMeeting = {
//     "method": "PUT",
//     "hostname": "api.zoom.us",
//     "port": null,
//     "path": "/v2/meetings/" + tempPars.get("Id") + "/status",
//     "headers": {
//         "content-type": "application/json",
//         "authorization": "Bearer " + access_token
//     }
// };

//#################################################################################
//#############################  API Functions  ###################################
//#################################################################################

function callAPI(options, type) {
    var api = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            // console.log(body.toString());
            jsonBody = JSON.parse(body)
        });
    });

    if(type == "endMeeting"){
        api.write(JSON.stringify({action: 'end'}));
    }
    api.end();
}

function endMeetingFunc(el){
    // End Meeting
    // endMeeting["headers"]["authorization"] = "Bearer " + access_token;
    // callAPI(endMeeting, "endMeeting")

    // stop listeners
    rtdb.ref('ChatRooms/' + roomId + "/general/").off();
    rtdb.ref('ChatRooms/' + roomId + "/resources/").off();
    rtdb.ref('ChatRooms/' + roomId + "/questions/").off();
    // delete chat
    rtdb.ref('ChatRooms/' + tempPars.get("Id")).remove();
    // close window
    // clearInterval(appTracker);
    window.close();
}
