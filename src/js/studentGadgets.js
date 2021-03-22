const {desktopCapturer} = require('electron');

//######################################################################
//######################## Checking Apps Track #########################
//######################################################################
let blocklist = ["youtube", "minecraft", "among", "fortnite", 
                "valorant", "instagram", "tiktok", "facebook", 
                ".io", "messages", "discord", "pintrest", 
                "twitch", "twitter", "coolmathgames", "steam"];

let listApps;
function refreshList(){
    let inputSources = desktopCapturer.getSources({
        types: ['window']
    });
    
    inputSources.then(function(result) {
        listApps = result.map(value => {
            return value.name;
        });
    });
}
refreshList();

let wasOffTask = false;
let appTracker = setInterval(function(){ 

    let flag = false;
    console.log(listApps);
    for(let i = 0; i < listApps.length; i++){
        let tempstr = listApps[i].toLowerCase();
        for(let n = 0; n < blocklist.length; n++){
            if(tempstr.includes(blocklist[n])){
                flag = true;

                if(!wasOffTask){
                    wasOffTask = true;
                    rtdb.ref('ChatRooms/'  + roomId).child('offTask').update({
                        newOffTask: email
                    });
                    console.log("offTask")
                }
                break;
            }
        }
        if(flag){
            break;
        }
    }

    if(wasOffTask){
        if(!flag){
            wasOffTask = false;
            console.log("onTask")
            rtdb.ref('ChatRooms/' + roomId).child('onTask').update({
                newOnTask: email
            });
        }
    }

    refreshList();
}, 10000);

const notifier = require('node-notifier');
const path = require('path');

let dbNudged = rtdb.ref('ChatRooms/' + roomId).child('nudged');
dbNudged.on('child_added', snap => {
    let tempVal = snap.val();
    if(tempVal == email){
        // Object

        console.log("hi");
        notifier.notify({
            title: 'Stay on Task',
            message: "Please stay on task!",
            icon: __dirname + '/assets/nobackgroundSmall.png',
            appID : 'com.classally.app'
        });

        rtdb.ref('ChatRooms/' + roomId + "/nudged/" + snap.key).remove();
    }
});

//######################################################################
//########################### Engage Feature ###########################
//######################################################################

let questionType = document.getElementById("questionType");
let questionSentence = document.getElementById("questionSentence");
let responseSection = document.getElementById("responseSection");
let questionStatus = document.getElementById("questionStatus");
let submitAnswer = document.getElementById("submitAnswer");
let responseType = "";

let dbEngage = rtdb.ref('ChatRooms/' + roomId).child('engage');
dbEngage.on('child_added', snap => {

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
    }

    let tempVal = snap.val();
    questionStatus.innerText = "Question";
    questionStatus.classList.remove("noQuestions");
    responseType = tempVal.questionType;
    let questionText = tempVal.question;

    console.log(tempVal);
    console.log(questionText);

    questionType.style.display = "block";
    questionSentence.style.display = "block";
    submitAnswer.style.opacity = "100%";
    questionSentence.innerText =  questionText;

    if(responseType != "freeResponse"){
        let responseOptions = tempVal.options;
        responseSection.innerHTML = `
            <div id="multipleChoice">
            </div>
        `;
        let multipleChoice = document.getElementById("multipleChoice");
        if(responseType == "singleSelect"){
            questionType.innerHTML = "<strong>Single Select</strong>";
            for(let i = 0; i < responseOptions.length; i++){
                multipleChoice.innerHTML += `
                <label class="radio">
                    <input type="radio" name="answer" value="` + responseOptions[i] + `">
                    ` + responseOptions[i] + `
                </label>
                <br>
                `;
            }
        }else{
            questionType.innerHTML = "<strong>Multiple Select</strong>";
            for(let i = 0; i < responseOptions.length; i++){
                multipleChoice.innerHTML += `
                <label class="checkbox">
                    <input type="checkbox" name="answer" value="` + responseOptions[i] + `">
                    ` + responseOptions[i] + `
                </label>
                <br>
                `;
            }
        }
    }else{
        questionType.innerHTML = "<strong>Free Response</strong>";
        responseSection.innerHTML = `
            <textarea id="response-text" class="textarea" rows="6"
            placeholder="Put your response here..."></textarea>
        `;
    }
    // rtdb.ref('ChatRooms/' + roomId + "/engage/" + snap.key).remove();
});

let errorModal = document.getElementById("modal-error");
let errorDetails = document.getElementById("error-details");
let closeError = document.getElementById("closeError");
errorModal.style.display = "none";

closeError.onclick = function(){
    errorModal.style.display = "none";
}

submitAnswer.onclick = function(){

    let questionExists = true;
    rtdb.ref('ChatRooms/' + roomId + "/engage").child('engageQuestion')
        .once("value").then(function(snapshot) {
            questionExists = snapshot.exists();

            if(!questionExists){
                questionStatus.innerText = "No Questions Currently"
                questionStatus.classList.add("noQuestions");
                questionType.style.display = "none";
                questionSentence.style.display = "none";
                submitAnswer.style.opacity = "0%";
                responseSection.innerHTML = ``;
                errorModal.style.display = "block";
                errorDetails.innerText = "Question Session Ended";
            }else if(responseType != "freeResponse"){

                if(responseType == "singleSelect"){
                    
                    let radios = document.getElementsByName('answer');
                    let chosenRadio = "";
                    let hasAnswer = false;
                    for (let i = 0; i < radios.length; i++) {
                      if (radios[i].checked) {
                        // do whatever you want with the checked radio
                        chosenRadio = (i+1);
                        hasAnswer = true;
                        break;
                      }
                    }
                    
                    if(hasAnswer){
                        rtdb.ref('ChatRooms/' + roomId).child('responses').update({
                            [username]: chosenRadio
                        }).then(function(){
                            questionStatus.innerText = "No Questions Currently"
                            questionStatus.classList.add("noQuestions");
                            questionType.style.display = "none";
                            questionSentence.style.display = "none";
                            submitAnswer.style.opacity = "0%";
                            responseSection.innerHTML = ``;
                            errorModal.style.display = "block";
                            errorDetails.innerText = "Response Recorded";
                        });
                    }else{
                        errorModal.style.display = "block";
                        errorDetails.innerText = "You must select one option!";
                    }
        
                }else{
        
                    let checks = document.getElementsByName('answer');
                    let chosenChecks = "";
                    let hasAnswer = false;
                    for (let i = 0; i < checks.length; i++) {
                      if (checks[i].checked) {
                        // do whatever you want with the checked radio
                        chosenChecks += " " + (i+1) + ",";
                        hasAnswer = true;
                      }
                    }
                    
                    if(hasAnswer){
                        rtdb.ref('ChatRooms/' + roomId).child('responses').update({
                            [username]: chosenChecks
                        }).then(function(){
                            questionStatus.innerText = "No Questions Currently"
                            questionStatus.classList.add("noQuestions");
                            questionType.style.display = "none";
                            questionSentence.style.display = "none";
                            submitAnswer.style.opacity = "0%";
                            responseSection.innerHTML = ``;
                            errorModal.style.display = "block";
                            errorDetails.innerText = "Response Recorded";
                        });
                    }else{
                        errorModal.style.display = "block";
                        errorDetails.innerText = "You must select one option!";
                    }
        
                }
            }else{
                let responseText = document.getElementById("response-text").value;
        
                if(responseText != ""){
                    rtdb.ref('ChatRooms/' + roomId).child('responses').update({
                        [username]: responseText
                    }).then(function(){
                        questionStatus.innerText = "No Questions Currently"
                        questionStatus.classList.add("noQuestions");
                        questionType.style.display = "none";
                        questionSentence.style.display = "none";
                        submitAnswer.style.opacity = "0%";
                        responseSection.innerHTML = ``;
                        errorModal.style.display = "block";
                        errorDetails.innerText = "Response Recorded";
                    });
                }else{
                    errorModal.style.display = "block";
                    errorDetails.innerText = "You must respond!";
                }
            }
    });

}