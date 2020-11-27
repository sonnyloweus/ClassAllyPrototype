const { removeTabIndexAndUpdateFocus } = require("custom-electron-titlebar/lib/common/dom");

let messageForm = document.getElementById("messageForm");
let roomId = tempPars.get("Id");

let startDate = Date.now();

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
generalBox.innerHTML += `
    <div class="message">
        <p class="nameTag">ClassAlly Bot</p>
        <p class="textTag">Post general info here:</p>
    </div>
`;
resourcesBox.innerHTML += `
    <div class="message">
        <p class="nameTag">ClassAlly Bot</p>
        <p class="textTag">Post resource links here:</p>
    </div>
`;
questionsBox.innerHTML += `
    <div class="message">
        <p class="nameTag">ClassAlly Bot</p>
        <p class="textTag">Post questions here:</p>
    </div>
`;

let lastGeneral = "";
let dbGeneral = rtdb.ref('ChatRooms/' + roomId).child('general');
dbGeneral.endAt().on('child_added', snap => {
    if(Date.now() - startDate > 2000){

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

        if(currentChat == 1 && smartChatToggle == -1){
            generalUnreads = 0;
        }else{
            generalUnreads += 1;
        }
        calculateUnreads();
        generalBox.scrollTop = generalBox.scrollHeight;
    }
})

let lastResource = "";
let dbResources = rtdb.ref('ChatRooms/' + roomId).child('resources');
dbResources.on('child_added', snap => {
    if(Date.now() - startDate > 2000){

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
        if(currentChat == 2 && smartChatToggle == -1){
            resourceUndreads = 0;
        }else{
            resourceUndreads += 1;
        }
        calculateUnreads();
        resourcesBox.scrollTop = resourcesBox.scrollHeight;
    }
})

let lastQuestions = "";
let dbQuestions = rtdb.ref('ChatRooms/' + roomId).child('questions');
dbQuestions.on('child_added', snap => {
    if(Date.now() - startDate > 2000){

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
        if(currentChat == 3 && smartChatToggle == -1){
            questionUnreads = 0;
        }else{
            questionUnreads += 1;
        }
        calculateUnreads();
        questionsBox.scrollTop = questionsBox.scrollHeight;
    }
});