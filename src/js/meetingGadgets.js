//list of what I need to do:
// - finish engage feature
// - stay in front of screen, cannot be seen by share screen

let Connected = document.getElementById("Connected");
let onTaskStudents = document.getElementById("onTaskStudents");
let ConnectedEmails = [];
let ConnectedNames = [];
let allStudents = [];
let allStudentEmails = [];

let fraction = document.getElementById("fraction");
fraction.innerText = ConnectedEmails.length + "/" + students; 

// classroomID

let dbParticipants = rtdb.ref('ChatRooms/' + roomId).child('participants');
dbParticipants.on('child_added', snap => {
    let tempKey = snap.key;

    ConnectedEmails.push(snap.val().email);
    ConnectedNames.push(tempKey);
    drawConnected();
    fraction.innerText = ConnectedEmails.length + "/" + students; 
    drawApplicationTracker();
});

dbParticipants.on('child_removed', snap => {
    let tempKey = snap.key;

    if(ConnectedEmails.includes(snap.val().email)){
        const index = ConnectedEmails.indexOf(snap.val().email);
        if (index > -1) {
            ConnectedNames.splice(index, 1);
            ConnectedEmails.splice(index, 1);
            drawConnected();
        }
    }
    fraction.innerText = ConnectedEmails.length + "/" + students; 
    drawApplicationTracker();
})

function drawConnected(){
    Connected.innerHTML = "";
    for(let i = 0; i<ConnectedEmails.length; i++){
        Connected.innerHTML += `
        <div class="connectedMember">
            <div style="float: left">
                <p>
                    <span class="icon has-text-success">
                        <i class="fas fa-circle"></i>
                    </span>
                ` + ConnectedNames[i] + `</p>
            </div>
        </div>
    `;
    }
}

//######################################################################
//######################### Asking Questions ###########################
//######################################################################

//switching question type function now inside meetingPopout.html
let askQuestion = document.getElementById("askQuestion");
let questionType = document.getElementById("questionType");
let questionText = document.getElementById("question-text");
let endSession = document.getElementById("endSession");
let optionColors = ["tomato", "#2D9CDB", "#EB5757", "#27AE60", "#BD81F4"]
let tempQuestionType = "";
let optionValues = [];
let responded = 0;

askQuestion.onclick = function(){
    let responseType = questionType.value;    
    let questionInputed = questionText.value;
    tempQuestionType = responseType;
    if(questionInputed == ""){
        errorModal.style.display = "block";
        errorDetails.innerText = "Please include a question!";
    }else{
        if(questionType.value != "freeResponse"){
            let flag = false;
            let optionText = [];
            let optionTexts = document.getElementsByClassName("optionText");
            for(let i = 0; i < optionTexts.length; i++){
                if(optionTexts[i].value == "") flag = true; 
                optionText.push(optionTexts[i].value);
            }

            if(flag){
                errorModal.style.display = "block";
                errorDetails.innerText = "Please make sure all options are filled!";
            }else{
                rtdb.ref('ChatRooms/' + tempPars.get("Id")).child('engage').update({
                    engageQuestion: {
                        questionType: responseType,
                        question: questionInputed,
                        options: optionText
                    }
                }).then(function(){
                    errorModal.style.display = "block";
                    errorDetails.innerText = "Question Sent! You can close the questioning session by clicking End Session";
                    askQuestion.disabled = true;
                    endSession.disabled = false;

                    questionEditor.style.display = "none";
                    responseEditor.style.display = "block";

                    let optionAxisLabel = "";
                    let optionFills="";
                    let optionCount = optionText.length;
                    for(let i = 0; i < optionCount; i++){
                        optionAxisLabel += "<span>"+ (i+1) + "</span>";
                        optionFills += "<span class='optionRectFills' style='background-color: "+ optionColors[i] +"'></span>";
                        optionValues.push(0);
                    }

                    responseEditor.innerHTML = `
                        <h2 style="float: left; margin-top: -30px;" id="responseCount">Responses: 0/` + students +  `</h2>
                        <div id="allSelectResponses">
            
                        </div>
                        <div id="graphRespnses">
                            <div id="optionsRects">
                                ` + optionFills + `
                            </div>
                            <div id="graphAxis"></div>
                            <div id="optionsAxis">
                                ` + optionAxisLabel + `
                            </div>
                        </div>
                    `;
                    //<p class="keyResponse"><strong>Sonny Lowe: </strong>1</p>
                });
            }
        }else{
            rtdb.ref('ChatRooms/' + tempPars.get("Id")).child('engage').update({
                engageQuestion: {
                    questionType: responseType,
                    question: questionInputed
                }
            }).then(function(){
                errorModal.style.display = "block";
                errorDetails.innerText = "Question Sent! You can close the questioning session by clicking End Session";
                askQuestion.disabled = true;
                endSession.disabled = false;

                questionEditor.style.display = "none";
                responseEditor.style.display = "block";
                responseEditor.innerHTML = `
                    <h2 style="float: left; margin-top: -30px;">Responses:</h2>
                    <div id="allFreeResponses">
                        
                    </div>
                `;
                // <p class="keyResponse"><strong>Sonny Lowe</strong></p>
                // <p class="valueResponse">blah </p>
            });
        }
    }
}

let dbEngage = rtdb.ref('ChatRooms/' + roomId).child('responses');
dbEngage.on('child_added', snap => {
    let tempKey = snap.key;
    let tempVal = snap.val();
    if(endSession.disabled == true){
        rtdb.ref('ChatRooms/' + roomId + "/responses").remove();
    }else{
        responded += 1;
        let responseCount = document.getElementById("responseCount");
        responseCount.innerHTML = "Responses: " + responded + "/" + students

        if(tempQuestionType != "freeResponse"){
            let allSelectResponses = document.getElementById("allSelectResponses");
            let optionsRects = document.getElementsByClassName("optionRectFills");
            let ratioFill = 100/responded; 
            
            if(tempQuestionType == "singleSelect"){
                optionValues[tempVal-1] += 1;
                allSelectResponses.innerHTML += `
                    <p class="keyResponse"><strong>`+ tempKey +`: </strong>`+ tempVal +`</p>
                `;
                optionsRects[tempVal-1].style.height = (optionValues[tempVal-1] * ratioFill) + "%";
            }else{
                let chosenValues = tempVal.substring(0, tempVal.length-1).split(",")
                for(let i = 0; i < chosenValues.length; i++){
                    optionValues[chosenValues[i]-1] += 1;
                    optionsRects[chosenValues[i]-1].style.height = (optionValues[chosenValues[i]-1] * ratioFill) + "%";
                }
                allSelectResponses.innerHTML += `
                    <p class="keyResponse"><strong>`+ tempKey +`: </strong>`+ tempVal.substring(0, tempVal.length-1) +`</p>
                `;
            }
        }else{
            let allFreeResponses = document.getElementById("allFreeResponses");
            allFreeResponses.innerHTML += `
                <p class="keyResponse"><strong>`+ tempKey +`</strong></p>
                <p class="valueResponse">`+ tempVal +`</p>
            `;

        }
    }
});

endSession.onclick = function(){
    errorModal.style.display = "block";
    errorDetails.innerText = "Question Session Ended!";
    askQuestion.disabled = false;
    endSession.disabled = true;

    questionEditor.style.display = "block";
    responseEditor.style.display = "none";
    
    rtdb.ref('ChatRooms/' + roomId + "/engage/engageQuestion").remove();
    rtdb.ref('ChatRooms/' + roomId + "/responses").remove();
}


//######################################################################
//######################## Checking Apps Track #########################
//######################################################################
let offTask = [];

function drawApplicationTracker(){
    onTaskStudents.innerHTML = "";
    let offTaskHTML = "";
    let onTaskHTML = "";
    for(let i = 0; i<ConnectedEmails.length; i++){
        let name = ConnectedNames[i];
        if(name.length > 10) name = name.substring(0,10);
        if(offTask.includes(ConnectedEmails[i])){
            offTaskHTML += `
                <div class="studentTaskStatus">
                    <p>
                        <span id="taskStatus" class="icon has-text-danger">
                            <i class="fas fa-exclamation-triangle"></i>
                        </span> `+ name +`

                        <button data-name = "` + name + `" title="` + ConnectedEmails[i] + `" onclick="nudgeStudent(this)" class="button is-danger is-outlined nudgeButton">
                            <span>nudge</span>
                        </button>
                    </p>
                </div>`
            ;
        }else{
            onTaskHTML += `
                <div class="studentTaskStatus">
                    <p>
                        <span id="taskStatus" class="icon has-text-success">
                            <i class="fas fa-check-square"></i>
                        </span> `+ name +`
                    </p>
                </div>`
            ;
        }

        onTaskStudents.innerHTML = offTaskHTML + onTaskHTML;
    }
};

function nudgeStudent(el){
    let emailNudged = el.title; 
    let nameNudged = $(el).data('name')
    rtdb.ref('ChatRooms/' + tempPars.get("Id")).child('nudged').update({
        nameNudged: emailNudged
    });
}

let dbOffTask = rtdb.ref('ChatRooms/' + roomId).child('offTask');
dbOffTask.on('child_added', snap => {
    let tempVal = snap.val();

    offTask.push(tempVal);

    rtdb.ref('ChatRooms/' + roomId + "/offTask/" + snap.key).remove();
    drawApplicationTracker();
});

let dbonTask = rtdb.ref('ChatRooms/' + roomId).child('onTask');
dbonTask.on('child_added', snap => {
    let tempVal = snap.val();
    let indexNum = offTask.indexOf(tempVal)
    
    if(indexNum != -1){
        console.log(offTask)
        offTask.splice(indexNum, 1);
        console.log("backOnTask")
        console.log(offTask)
    }

    rtdb.ref('ChatRooms/' + roomId + "/onTask/" + snap.key).remove();
    drawApplicationTracker();
});