//#################################################################################
//###############################  Variables ######################################
//#################################################################################
let AddSlides = document.getElementById("AddSlides");
let slider = document.getElementById("slider");
let currentSlide = 1;
let maxSlide = 6;
let participants = document.getElementById("participants");


//#################################################################################
//###############################  Html Func ######################################
//#################################################################################
function slide(e) {
    if (e.innerText != ">" && e.innerText != "<") {
        currentSlide = parseInt(e.innerText);

    } else if (e.innerText == ">") {
        let idNum = 0;
        if (currentSlide == maxSlide) {
            idNum = 1;
        } else {
            idNum = currentSlide + 1;
        }
        currentSlide = idNum;
        let idName = "slide-" + idNum;
        // console.log(idName);
        document.getElementById(idName).scrollIntoView();
    } else if (e.innerText == "<") {
        let idNum = 0;
        if (currentSlide == 1) {
            idNum =  parseInt(maxSlide);
        } else {
            idNum = currentSlide - 1;
        }
        currentSlide = idNum;
        let idName = "slide-" + idNum;
        // console.log(idName);
        document.getElementById(idName).scrollIntoView();
    }
}

//#################################################################################
//##################################  Objects #####################################
//#################################################################################

// https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetings
//  /v2/users/sonny.lowe23@bcp.org/meetings?page_number=1&page_size=30&type=upcoming
// https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingregistrants
//  /v2/meetings/000000000/registrants?page_number=1&page_size=30&status=approved
// https://marketplace.zoom.us/docs/api-reference/zoom-api/dashboards/dashboardmeetingparticipants
//  /v2/metrics/meetings/0000000000/participants?page_size=30&type=live

let getMeetings = {
    "method": "GET",
    "hostname": "api.zoom.us",
    "port": null,
    "path": "/v2/users/sonny.lowe23@bcp.org/meetings?page_number=1&page_size=30&type=upcoming",
    "headers": {
        "content-type": "application/json",
        "authorization": "Bearer " + access_token
    }
};

let listParticipants = {
    "method": "GET",
    "hostname": "api.zoom.us",
    "port": null,
    "path": "/v2/metrics/meetings/7113140148/participants?page_size=30&type=live",
    "headers": {
        "content-type": "application/json",
        "authorization": "Bearer " + access_token
    }
}

//#################################################################################
//##################################  Onclicks ####################################
//#################################################################################

participants.onclick = function(){
    listParticipants["headers"]["authorization"] = "Bearer " + access_token;
    callAPI(listParticipants, "listParticipants");
}

//#################################################################################
//#################################  Functions ####################################
//#################################################################################

function callAPI(options, type) {
    var api = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            body = JSON.parse(body)

            if (type == "getMeetings") {
                meetingsFunc(body);
            }else if (type == "listParticipants"){
                console.log(body);
            }
        });
    });

    api.end();
}

function meetingsFunc(body) {
    maxSlide = body.meetings.length;
    for (let i = 1; i <= maxSlide; i++) {

        let meetObj = body.meetings[i - 1]
        // duration, id, join_url, start_time, topic
        let tempDuration = meetObj["duration"];
        let tempId = meetObj["id"];
        let tempJoin = meetObj["join_url"];
        let tempStart = meetObj["start_time"];
        // yyyy-mm-ddThh:mm:ssZ
        let tempDate = tempStart.substring(0, 9);
        let tempTime = tempStart.substring(11, 18);
        // console.log(tempDate)
        // console.log(tempTime)
        let tempTopic = meetObj["topic"];

        AddSlides.innerHTML = AddSlides.innerHTML + '<div id="slide-' + i + '">' +
            '<p>' + i + '</p>' +
            '<div id="meetingSlide' + i + '" class="meetingSlide">' +
            '<p class="is-size-4">' + tempTopic + '</p>' +
            '<p class="is-size-6">Time: ' + tempTime + ' on ' + tempDate + '</p>' +
            '<p class="is-size-6">Meeting Id: ' + tempId + '</p>' +
            '<p class="is-size-6">Duration: ' + tempDuration + '</p>' +
            '<a class="is-size-6">' + tempJoin + '</a>' +
            '</div>' +
            '</div>';
        slider.innerHTML = slider.innerHTML + "<a href=#slide-" + i + " onclick='slide(this)'>" + i + "</a>";
        AddSlides = document.getElementById("AddSlides");
        slider = document.getElementById("slider");
    }
    // console.log(slider);
}