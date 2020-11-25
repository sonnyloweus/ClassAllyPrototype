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

//#################################################################################
//################################  Other Info  ###################################
//#################################################################################
let expandInfo = document.getElementById("expandInfo");
let topicHTML = document.getElementById("topicHTML");
let meetingInfo = document.getElementById("meetingInfo");
let idHTML = document.getElementById("idHTML");
idHTML.innerHTML += tempPars.get("classroomId");


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
    }else if (currentChat == 2){
        resourcesBox.style.display = "block";
    }else{
        questionsBox.style.display = "block";
    }
}
