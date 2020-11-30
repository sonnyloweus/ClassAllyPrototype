const {desktopCapturer} = require('electron');


let listApps;
function refreshList(){
    let inputSources = desktopCapturer.getSources({
        types: ['window']
    });
    
    inputSources.then(function(result) {
        listApps = result.map(value => {
            return value.name;
        });
        console.log(listApps);
    });
}
refreshList();

let appTracker = setInterval(function(){ 
    rtdb.ref('ChatRooms/' + roomId).child('participants').update({
        [username]: {
            apps: listApps,
            email: email
        }
    });
    refreshList();
}, 5000);

const notifier = require('node-notifier');
const path = require('path');

let dbNudged = rtdb.ref('ChatRooms/' + roomId).child('nudged');
dbNudged.on('child_added', snap => {
    let tempVal = snap.val();
    if(tempVal == email){
        // Object
        notifier.notify({
            title: 'Stay on Task',
            message: "I know when you are sleeping, I know when your awake, I know if you've been bad or good so be good for goodness sake",
            icon: __dirname + '/assets/nobackgroundSmall.png',
            appID : 'ClassAlly'
        });

        rtdb.ref('ChatRooms/' + roomId + "/nudged/" + snap.key).remove();
    }
});

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
    if(responseType != "freeResponse"){

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
}