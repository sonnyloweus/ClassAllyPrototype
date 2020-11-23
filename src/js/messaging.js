const { removeTabIndexAndUpdateFocus } = require("custom-electron-titlebar/lib/common/dom");

let messageForm = document.getElementById("messageForm");
let roomId = tempPars.get("Id");
let username = tempPars.get("username");

function submitMessage(){
    const date = new Date()
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    };
    const time = new Intl.DateTimeFormat('en-US', options).format(date)
    console.log(time)
    let tempKey = username + " " + time;
    let message = messageForm['messageContent'].value;
    messageForm.reset();
    if(currentChat == 1){
        rtdb.ref('ChatRooms/' + roomId + "/general/").update({
            [tempKey]: message
        });
    }else if (currentChat == 2){
        rtdb.ref('ChatRooms/' + roomId + "/resources/").update({
            [tempKey]: message
        });
    }else{
        rtdb.ref('ChatRooms/' + roomId + "/questions/").update({
            [tempKey]: message
        });
    }
}

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitMessage();
});

messageForm.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        if(messageForm['messageContent'].value != ""){
            submitMessage();
        }
		return false;
    }
});

// generalBox
// resourcesBox
// questionsBox

let lastGeneral = "";
let dbGeneral = rtdb.ref('ChatRooms/' + roomId).child('general');
dbGeneral.on('child_added', snap => {
    let tempKey = snap.key;
    if(snap.key != "HelperBot"){
        let amPm = snap.key.substring(snap.key.length-2);
        tempKey = snap.key.substring(0, snap.key.length-6) + " " + amPm;
    }

    if(lastGeneral == tempKey){
        generalBox.innerHTML += `
            <div class="message">
                <p class="textTag">` + snap.val() + `</p>
            </div>
        `;
    }else{
        generalBox.innerHTML += `
            <div class="message">
                <p class="nameTag">` + tempKey + `</p>
                <p class="textTag">` + snap.val() + `</p>
            </div>
        `;
    }
    lastGeneral = tempKey;

    generalBox.scrollTop = generalBox.scrollHeight;
})

let lastResource = "";
let dbResources = rtdb.ref('ChatRooms/' + roomId).child('resources');
dbResources.on('child_added', snap => {
    let tempKey = snap.key;
    if(snap.key != "HelperBot"){
        let amPm = snap.key.substring(snap.key.length-2);
        tempKey = snap.key.substring(0, snap.key.length-6) + " " + amPm;
    }

    if(lastResource == tempKey){
        resourcesBox.innerHTML += `
            <div class="message">
                <p class="textTag">` + snap.val() + `</p>
            </div>
        `;
    }else{
        resourcesBox.innerHTML += `
            <div class="message">
                <p class="nameTag">` + tempKey + `</p>
                <p class="textTag">` + snap.val() + `</p>
            </div>
        `;
    }
    lastResource = tempKey;

    resourcesBox.scrollTop = resourcesBox.scrollHeight;
})

let lastQuestions = "";
let dbQuestions = rtdb.ref('ChatRooms/' + roomId).child('questions');
dbQuestions.on('child_added', snap => {
    let tempKey = snap.key;
    if(snap.key != "HelperBot"){
        let amPm = snap.key.substring(snap.key.length-2);
        tempKey = snap.key.substring(0, snap.key.length-6) + " " + amPm;
    }

    if(lastQuestions == tempKey){
        questionsBox.innerHTML += `
            <div class="message">
                <p class="textTag">` + snap.val() + `</p>
            </div>
        `;
    }else{
        questionsBox.innerHTML += `
            <div class="message">
                <p class="nameTag">` + tempKey + `</p>
                <p class="textTag">` + snap.val() + `</p>
            </div>
        `;
    }
    lastQuestions = tempKey;

    questionsBox.scrollTop = questionsBox.scrollHeight;
})