//list of what I need to do:
// - finish engage feature

let notConnected = document.getElementById("notConnected");
let Connected = document.getElementById("Connected");
let onTaskStudents = document.getElementById("onTaskStudents");
let unConnectedStudents = [];
let unConnectedEmails = [];
let ConnectedEmails = [];
let ConnectedNames = [];
let allStudents = [];
let allStudentEmails = [];

// classroomID
students = students.split('-');
console.log(students);

let dbParticipants = rtdb.ref('ChatRooms/' + roomId).child('participants');
dbParticipants.on('child_added', snap => {
    let tempKey = snap.key;

    ConnectedEmails.push(snap.val().email);
    ConnectedNames.push(tempKey);
    drawConnected();
    if(unConnectedEmails.includes(snap.val().email)){
        const index = unConnectedEmails.indexOf(snap.val().email);
        if (index > -1) {
            unConnectedStudents.splice(index, 1);
            unConnectedEmails.splice(index, 1);
            drawUnconnected();
        }
    }
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

    console.log(snap.val().emai);
    console.log(allStudentEmails);

    if(allStudentEmails.includes(snap.val().email)){
        unConnectedEmails.push(snap.val().email);
        unConnectedStudents.push(tempKey);
        drawUnconnected();
        console.log("replaced into unconnected");
    }
    console.log(ConnectedEmails)
    drawApplicationTracker();
})

db.collection('users').doc(userId).collection("students").get().then((snapshot) => {
    let idsList = snapshot.docs;
    // console.log(idsList)
    snapshot.docs.forEach(function (doc, i) {
        if(students.includes(doc.id)){
            console.log(doc.id);
            allStudents.push(doc.data().name);
            allStudentEmails.push(doc.data().email);
            unConnectedStudents.push(doc.data().name);
            unConnectedEmails.push(doc.data().email);
        }
        
    });
    console.log(unConnectedStudents);

    drawUnconnected();
    drawApplicationTracker();
});

function drawUnconnected(){
    notConnected.innerHTML = "";
    for(let i = 0; i<unConnectedStudents.length; i++){
        notConnected.innerHTML += `<div class="unconnectedMember">
        <div style="float: left">
            <p>
            <span class="icon has-text-danger">
            <i class="fas fa-circle"></i>
            </span> ` + unConnectedStudents[i] + `
            </p>
            </div>
        </div>`;
    }
}

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


//######################################################################
//######################## Checking Apps Track #########################
//######################################################################
let blocklist = ["youtube", "minecraft", "among", "fortnite", 
                "valorant", "instagram", "tiktok", "facebook", 
                ".io", "messages", "discord", "pintrest", 
                "twitch", "twitter", "coolmathgames"];
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

function checkOffTask(){
    offTask = [];

    dbParticipants.once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            let childKey = childSnapshot.key;
            let childData = childSnapshot.val();
            let apps = childData.apps;
            let flag = false;
            for(let i = 0; i < apps.length; i++){
                let tempstr = apps[i].toLowerCase();
                for(let n = 0; n < blocklist.length; n++){
                    if(tempstr.includes(blocklist[n])){
                        flag = true;
                        offTask.push(childData.email);
                        console.log(childData.email)
                        break;
                    }
                }
                if(flag){
                    break;
                }
            }
        });
    }).then(function(){
        drawApplicationTracker();
    });
}

let appTracker = setInterval(function(){ 
    checkOffTask();
}, 20000);

