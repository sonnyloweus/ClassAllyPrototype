//#################################################################################
//############################  Custom TitleBar  ##################################
//#################################################################################
//npm i custom-electron-titlebar
const customTitlebar = require('custom-electron-titlebar');
const {Menu} = require('electron').remote;

let menuTemplate = Menu.buildFromTemplate([
    {
        label: 'View',
            submenu: [
            { label:'Minimize', 
                role:"minimize"
            },
            { label:'Close', 
                role:"close"
            },
            { label:'Reload', 
                role:"reload"
            },
            { label:'Force Reload', 
                role:"forceReload"
            }
        ]
    }
  ])

new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#444'),
    overflow: "hidden",
    menu: menuTemplate,
    // icon: './assets/timerIcon-full.png',
});

let titleBarTitle = document.querySelector('.window-title');
titleBarTitle.innerHTML = "";

//#################################################################################
//#################################  Variable  ####################################
//#################################################################################
let topicHTML = document.getElementById("topicHTML");
let idHTML = document.getElementById("idHTML");
let passwordID = document.getElementById("passwordID");
let copyJoinURL = document.getElementById("copyJoinURL");
let startHTML = document.getElementById("startHTML");
let copyValidation = document.getElementById("copyValidation");
let controlPanel = document.getElementById("controlPanel");
let expandInfo = document.getElementById("expandInfo");
let meetingInfo = document.getElementById("meetingInfo");
const opn = require('opn');
var http = require("https");
let dotenv = require('dotenv');
const result = dotenv.config();
let endClass = document.getElementById("endClass");
let controlBool = true;

//#################################################################################
//################################  Other Info  ###################################
//#################################################################################
let tempPars = (new URL(window.location.href)).searchParams;
topicHTML.innerHTML = tempPars.get("topic") + " <br>";
idHTML.innerHTML += tempPars.get("Id");
passwordID.innerHTML += tempPars.get("password") + " <br>";
copyJoinURL.title = tempPars.get("joinURL");
startHTML.title = tempPars.get("startURL");
let access_token = tempPars.get("access_token");
let userId = tempPars.get("userId");


function copyText(id) {
    /* Get the text field */
    let temp = document.createElement("textarea");
    document.body.appendChild(temp);
    // console.log(id);
    temp.value = id.title;
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    copyValidation.innerHTML = '<i class="fa fa-spinner fa-spin fa-lg fa-fw"></i><span class="sr-only">Loading...</span>'
    copyValidation.style.display = "inline-block";
    setTimeout(function(){
        copyValidation.innerHTML = '<span class="icon"><i class="fas fa-check"></i></span>'
    }, 250)
}

let toggle = 1;

function openURL(id){
    opn(id.title);
    let zoomId = tempPars.get("Id");
    rtdb.ref('ChatRooms').update({
        [zoomId]: {
            general: {
                HelperBot: 'Post general info here:'
            },
            resources: {
                HelperBot: 'Post resource links here:'
            },
            questions: {
                HelperBot: 'Post questions here:'
            }
        }
    });

    startHTML.style.display = "none";
    controlPanel.style.display = "block";
    meetingInfo.style.paddingBottom = "0px"
    idHTML.innerHTML = "ID: &nbsp; " + tempPars.get("Id");
    passwordID.innerHTML = "Password: &nbsp; " + tempPars.get("password");

    topicHTML.innerHTML = tempPars.get("topic") + "<br><br><br><br><br>";
    expandInfo.innerHTML = `
        <span class="icon">
            <i class="fas fa-plus-circle"></i>
        </span>
        &nbsp;
        Info
    `;
    expandInfo.style.top = "55px";
    meetingInfo.style.height = "80px";
    toggle = toggle * -1;
}

expandInfo.onclick = function(){
    if(toggle == 1){
        topicHTML.innerHTML = tempPars.get("topic") + "<br><br><br><br><br>";
        expandInfo.innerHTML = `
            <span class="icon">
                <i class="fas fa-plus-circle"></i>
            </span>
            &nbsp;
            Info
        `;
        expandInfo.style.top = "55px";
        meetingInfo.style.height = "80px";
    }else if(toggle == -1){
        topicHTML.innerHTML = tempPars.get("topic") + "<br>";
        expandInfo.innerHTML = `
            <span class="icon">
                <i class="fas fa-minus-circle"></i>
            </span>
            &nbsp;
            Info
        `;
        if(startHTML.style.display == "none"){
            expandInfo.style.top = "23vh";
        }else{
            expandInfo.style.top = "33vh";
        }
        meetingInfo.style.height = "";
    }
    toggle = toggle * -1
}

let generalBox = document.getElementById("generalBox");
let resourcesBox = document.getElementById("resourcesBox");
let questionsBox = document.getElementById("questionsBox");
let currentChat = 1;

function switchChat(el, num){
    currentChat = num;
    let tempParent = el.parentNode;
    $("#chat1nav").removeClass('is-active');
    $("#chat2nav").removeClass('is-active');
    $("#chat3nav").removeClass('is-active');
    $(tempParent).addClass('is-active');
    generalBox.style.display = "none";
    resourcesBox.style.display = "none";
    questionsBox.style.display = "none";
    if(currentChat == 1){
        generalBox.style.display = "block";
    }else if (currentChat == 2){
        resourcesBox.style.display = "block";
    }else{
        questionsBox.style.display = "block";
    }
}


window.addEventListener("beforeunload", function(e){
    console.log(endClass.style.display)
    if(startHTML.style.display == "none" && endClass.style.display == ""){
        endClass.style.display = "block";
        e.preventDefault();
        e.returnValue = '';
    }
}, false);

//#################################################################################
//################################ Panel Toggles ##################################
//#################################################################################

let engageView = document.getElementById("engageView");
let questionsHidden = document.getElementById("questionsHidden");
let engageToggle = 1;
engageView.onclick = function(){
    if(engageToggle == -1){
        questionsHidden.style.display = "none";
        engageView.innerHTML = '<span class="icon"><i class="fas fa-plus-circle"></i></span>';
        engageView.parentElement.parentElement.style.height = "5vh";
    }else{
        questionsHidden.style.display = "block";
        engageView.innerHTML = '<span class="icon"><i class="fas fa-minus-circle"></i></span>';
        engageView.parentElement.parentElement.style.height = "14vh";
    }
    engageToggle *= -1;
}

let attendanceView = document.getElementById("attendanceView");
let attendanceHidden = document.getElementById("attendanceHidden");
let attendanceToggle = -1;
attendanceView.onclick = function(){
    if(attendanceToggle == -1){
        attendanceHidden.style.display = "none";
        attendanceView.innerHTML = '<span class="icon"><i class="fas fa-plus-circle"></i></span>';
        attendanceView.parentElement.parentElement.style.height = "5vh";
    }else{
        attendanceHidden.style.display = "block";
        attendanceView.innerHTML = '<span class="icon"><i class="fas fa-minus-circle"></i></span>';
        attendanceView.parentElement.parentElement.style.height = "14vh";
    }
    attendanceToggle *= -1;
}

let appTrackView = document.getElementById("appTrackView");
let appTrackHidden = document.getElementById("appTrackHidden");
let appTrackToggle = 1;
appTrackView.onclick = function(){
    if(appTrackToggle == -1){
        appTrackHidden.style.display = "none";
        appTrackView.innerHTML = '<span class="icon"><i class="fas fa-plus-circle"></i></span>';
        appTrackView.parentElement.parentElement.style.height = "5vh";
    }else{
        appTrackHidden.style.display = "block";
        appTrackView.innerHTML = '<span class="icon"><i class="fas fa-minus-circle"></i></span>';
        appTrackView.parentElement.parentElement.style.height = "14vh";
    }
    appTrackToggle *= -1;
}

let smartChatView = document.getElementById("smartChatView");
let smartChatHidden = document.getElementById("smartChatHidden");
let smartChatToggle = -1;
smartChatView.onclick = function(){
    if(smartChatToggle == -1){
        smartChatHidden.style.display = "none";
        smartChatView.innerHTML = '<span class="icon"><i class="fas fa-plus-circle"></i></span>';
        smartChatView.parentElement.parentElement.style.height = "5vh";
    }else{
        smartChatHidden.style.display = "block";
        smartChatView.innerHTML = '<span class="icon"><i class="fas fa-minus-circle"></i></span>';
        smartChatView.parentElement.parentElement.style.height = "50vh";
    }
    smartChatToggle *= -1;
}