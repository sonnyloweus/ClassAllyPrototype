//#################################################################################
//############################  Custom TitleBar  ##################################
//#################################################################################
//npm i custom-electron-titlebar
if(process.platform !== "darwin"){

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

}

let endClass = document.getElementById("endClass");
let underlay = document.getElementById("underlay");

window.addEventListener("beforeunload", function(e){
    if(endClass.style.display == "" || endClass.style.display == "none"){
        endClass.style.display = "block";
        underlay.style.display = "block";
        e.preventDefault();
        e.returnValue = '';
    }
}, false);

let tempPars = (new URL(window.location.href)).searchParams;
let username = tempPars.get("studentName");
let roomId = tempPars.get("classroomId");

//#################################################################################
//###############################  Leave Meeting  #################################
//#################################################################################

function endMeetingFunc(el){
    clearInterval(appTracker);
    // stop listeners
    rtdb.ref('ChatRooms/' + roomId + "/general/").off();
    rtdb.ref('ChatRooms/' + roomId + "/resources/").off();
    rtdb.ref('ChatRooms/' + roomId + "/questions/").off();
    rtdb.ref('ChatRooms/' + roomId + "/nudged/").off();
    // delete participant
    rtdb.ref('ChatRooms/' + roomId + "/participants/" + username).remove();
    // close window
    window.close();
}

underlay.onclick = function(){
    endClass.style.display = "none";
    underlay.style.display = "none";
}

let dbClass = rtdb.ref('ChatRooms/' + roomId + "/info");
dbClass.on('child_removed', snap => {
    // console.log("the teacher has ended the meeting")
    endClass.style.display = "block";
    endMeetingFunc();
});


//#################################################################################
//################################  Other Info  ###################################
//#################################################################################
let expandInfo = document.getElementById("expandInfo");
let topicHTML = document.getElementById("topicHTML");
let meetingInfo = document.getElementById("meetingInfo");
let idHTML = document.getElementById("idHTML");
idHTML.innerHTML += tempPars.get("classroomId");

let questionsPanel = document.getElementById("questionsPanel");
let engageView = document.getElementById("engageView");
let smartChat = document.getElementById("smartChat");
let smartChatView = document.getElementById("smartChatView");
let questionsHidden = document.getElementById("questionsHidden");
let smartChatHidden = document.getElementById("smartChatHidden");
questionsHidden.style.display = "none";
// -1 == opened     1 == closed

let totalUnreads = 0;
let generalUnreads = 0;
let questionUnreads = 0;
let resourceUndreads = 0;
let minimizedNotif = document.getElementById("minimizedNotif");
minimizedNotif.style.display = "none";

function calculateUnreads(){
    totalUnreads = generalUnreads + questionUnreads + resourceUndreads;
    if(totalUnreads == 0){
        minimizedNotif.style.display = "none";
    }else{
        minimizedNotif.style.display = "block";
        if(totalUnreads >= 10){
            minimizedNotif.innerText = "9+";
        }else{
            minimizedNotif.innerText = totalUnreads;
        }
    }
}

let engageClosed = 1;
let smartChatToggle = -1;
engageView.onclick = function(){
    if(engageClosed == 1){
        questionsPanel.style.height = "77vh";
        smartChat.style.height = "5vh";
        engageView.innerHTML = `
            <span class="icon"><i class="fas fa-minus-circle"></i></span>
        `;
        smartChatView.innerHTML = `
        <span class="icon"><i class="fas fa-plus-circle"></i></span>
        `;
        engageClosed = -1;
        smartChatToggle = 1;
        questionsHidden.style.display = "block";
        smartChatHidden.style.display = "none";
    }else{
        questionsPanel.style.height = "5vh";
        engageView.innerHTML = `
        <span class="icon"><i class="fas fa-plus-circle"></i></span>
        `;
        engageClosed = 1;
        questionsHidden.style.display = "none";
    }
}
smartChatView.onclick = function(){
    if(smartChatToggle == 1){
        questionsPanel.style.height = "5vh";
        smartChat.style.height = "77vh";
        smartChatView.innerHTML = `
            <span class="icon"><i class="fas fa-minus-circle"></i></span>
        `;
        engageView.innerHTML = `
        <span class="icon"><i class="fas fa-plus-circle"></i></span>
        `;
        engageClosed = 1;
        smartChatToggle = -1;
        questionsHidden.style.display = "none";
        smartChatHidden.style.display = "block";

        if(currentChat == 1){
            generalUnreads = 0;
        }else if(currentChat == 2){
            resourceUndreads = 0;
        }else if(currentChat == 3){
            questionUnreads = 0;
        }
        calculateUnreads();
    }else{
        smartChat.style.height = "5vh";
        smartChatView.innerHTML = `
        <span class="icon"><i class="fas fa-plus-circle"></i></span>
        `;
        smartChatToggle = 1;
        smartChatHidden.style.display = "none";
    }
}

let toggle = 1;

expandInfo.onclick = function(){
    if(toggle == 1){
        expandInfo.innerHTML = `
            <span class="icon">
                <i class="fas fa-plus-circle"></i>
            </span>
            &nbsp;
            Info
        `;
        expandInfo.style.top = "9vh";
        meetingInfo.style.height = "80px";
    }else if(toggle == -1){
        expandInfo.innerHTML = `
            <span class="icon">
                <i class="fas fa-minus-circle"></i>
            </span>
            &nbsp;
            Info
        `;
        expandInfo.style.top = "13vh";
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
        generalUnreads = 0;
    }else if (currentChat == 2){
        resourcesBox.style.display = "block";
        resourceUndreads = 0;
    }else{
        questionsBox.style.display = "block";
        questionUnreads = 0;
    }
    calculateUnreads();
}
