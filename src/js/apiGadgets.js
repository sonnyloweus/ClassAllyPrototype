//#################################################################################
//###############################  Variables ######################################
//#################################################################################
let AddSlides = document.getElementById("AddSlides");
let slider = document.getElementById("slider");
let currentSlide = 1;
let maxSlide = 6;
let participants = document.getElementById("participants");
let weekdays = ["Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"];

//npm install --save open
const open = require('open');

//#################################################################################
//###############################  Html Func ######################################
//#################################################################################
function slide(e) {
    // console.log(e.innerHTML);
    if (e.innerHTML != '<span class="icon"><i class="fas fa-arrow-left" aria-hidden="true"></i></span>' && e.innerHTML != '<span class="icon"><i class="fas fa-arrow-right" aria-hidden="true"></i></span>') {
        currentSlide = parseInt(e.innerText);

    } else if (e.innerHTML == '<span class="icon"><i class="fas fa-arrow-right" aria-hidden="true"></i></span>') {
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
    } else if (e.innerHTML == '<span class="icon"><i class="fas fa-arrow-left" aria-hidden="true"></i></span>') {
        let idNum = 0;
        if (currentSlide == 1) {
            idNum = parseInt(maxSlide);
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

// participants.onclick = function () {
//     listParticipants["headers"]["authorization"] = "Bearer " + access_token;
//     callAPI(listParticipants, "listParticipants");
// }

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
            } else if (type == "listParticipants") {
                console.log(body);
            }
        });
    });

    api.end();
}

function copyText(id) {
    /* Get the text field */
    let temp = document.createElement("textarea");
    document.body.appendChild(temp);
    console.log(id);
    temp.value = id.title;
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
}

function tConvert(time) {
    // Check correct time format and split into components
    let offset = (new Date().getTimezoneOffset())/60;
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    // let hours = parseInt(time[0].substring(0,2));
    // hours = ('0' + (hours - offset)).slice(-2)
    // time[0] = hours + time[0].substring(2);

    if (time.length > 1) { // If time format correct
        time = time.slice(1); // Remove full string match value
        time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    time[0] = ('0' + (parseInt(time[0]) - offset)).slice(-2);
    return time.join(''); // return adjusted time or original string
}

function showInfo(idName){
    let tempIdNum = idName.id.substring(idName.id.length-1);
    let typeButton = idName.id.substring(1, idName.id.length-1);
    if(typeButton == "meetingLink"){
        $("#meetingLink" + tempIdNum).toggle();
        $("#tempId" + tempIdNum).css('display', 'none');
        $(".meetingDate" + tempIdNum).css('display', 'none');
    }else if(typeButton == "tempId"){
        $("#meetingLink" + tempIdNum).css('display', 'none');
        $("#tempId" + tempIdNum).toggle();
        $(".meetingDate" + tempIdNum).css('display', 'none');
    }else{
        $("#meetingLink" + tempIdNum).css('display', 'none');
        $("#tempId" + tempIdNum).css('display', 'none');
        $(".meetingDate" + tempIdNum).toggle();
    }
    
    // $(".slider").find("> div").animate({height:"30vh"},500);
}

function openURL(id){
    open(id.title);
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
        let tempDate = tempStart.substring(0, 10);
        //yyyy-mm-dd
        let tempDateDate = new Date(tempDate.substring(0,4), tempDate.substring(5,7), tempDate.substring(8)).getDay();
        let tempWeekday = weekdays[tempDateDate];
        tempDate = tempDate.substring(5,7) + "/" + tempDate.substring(8) + "/" + tempDate.substring(0,4);
        if (tempDate.substring(0,1) == "0"){
            tempDate = tempDate.substring(1);
        }
        let tempTime = tConvert( tempStart.substring(11, 19));
        if (tempTime.substring(0,1) == "0"){
            tempTime = tempTime.substring(1);
        }
        if (tempTime.substring(tempTime.length - 4, tempTime.length - 2,) == "00"){
            tempTime = tempTime.substring(0,tempTime.length -5) +  tempTime.substring(tempTime.length -2);
        }
        // console.log(tempDate)
        // console.log(tempTime)

        let tempTopic = meetObj["topic"];

        AddSlides.innerHTML = AddSlides.innerHTML + 
        '<div id="slide-' + i + '">' +
            '<div id="meetingSlide' + i + '" class="meetingSlide">' +
                '<p style="margin-top: -5px;" class="meetingTopic is-size-5" >' + tempTopic + '</p>' +
                '<div class="buttons is-centered" style="margin-top: 12px;">' +
                    '<a id="BmeetingDate' + i + '" onclick="showInfo(this)" role="button" class="meetingButtons button is-info " data-target="" id=""><span class="icon"><i class="far fa-calendar-alt fa-xs"></i></span></a>' +
                    '<a id="BmeetingLink' + i + '" onclick="showInfo(this)" role="button" class="meetingButtons button is-info " data-target="" id=""><span class="icon"><i class="fas fa-link fa-xs"></i></span></a>' +
                    '<a id="BtempId' + i + '" onclick="showInfo(this)" role="button" class="meetingButtons button is-info" data-target="" id=""><span class="icon"><i class="fas fa-fingerprint fa-xs"></i></span></a>' +
                '</div>' +
            
                '<p id="meetingDate' + i + '" style="display:none" class="meetingDate' + i + ' is-size-6" >' + tempWeekday + ", " + tempDate + '</p>' +
                '<p id="meetingDate' + i + '" style="display:none" class="meetingDate' + i + ' is-size-6" >' + tempTime + '</p>' +
                '<p id="tempId' + i + '" style="display:none" class="is-size-6" >Meeting Id: ' + tempId + '</p>' +
                '<p id="meetingDate' + i + '" style="display:none" class="meetingDate' + i + ' is-size-7" >Duration: ' + tempDuration + ' mins</p>' +

                '<div id="meetingLink' + i + '" style="display:none">' +
                    '<p class="is-size-7" >Register / Open <br/> (paste in browser):</p>' +
                    '<a onclick="openURL(this)" class="meetingURL" id="meetingURL' + i + '" target="_blank" title="' + tempJoin + '"" ><span class="icon"><i class="fas fa-external-link-alt"></i></span></a>' +
                    '<a onclick="copyText(meetingURL' + i + ')"><span class="icon"><i class="far fa-copy fa-lg"></i></span></a>' +
                '</div>' +
            '</div>' +
        '</div>';

        // console.log(document.getElementById("BmeetingDate1"));
        // slider.innerHTML = slider.innerHTML + "<a href=#slide-" + i + " onclick='slide(this)'>" + i + "</a>";
        AddSlides = document.getElementById("AddSlides");
        slider = document.getElementById("slider");
    }
    // console.log(slider);
}