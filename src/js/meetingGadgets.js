let notConnected = document.getElementById("notConnected");
let Connected = document.getElementById("Connected");
let onTaskStudents = document.getElementById("onTaskStudents");
let unConnectedStudents = [];
let unConnectedEmails = [];
let allStudents = [];

// classroomID
console.log(classroomID);
students = students.split('-');
console.log(students);
console.log(userId);

let dbParticipants = rtdb.ref('ChatRooms/' + roomId).child('participants');
dbParticipants.on('child_added', snap => {
    let tempKey = snap.key;
    Connected.innerHTML += `
        <div class="connectedMember">
            <div style="float: left">
                <p>
                    <span class="icon has-text-success">
                        <i class="fas fa-circle"></i>
                    </span>
                ` + snap.key + `</p>
            </div>
        </div>
    `;
    console.log(unConnectedEmails.includes(snap.val().email));
    if(unConnectedEmails.includes(snap.val().email)){
        const index = unConnectedEmails.indexOf(snap.val().email);
        if (index > -1) {
            unConnectedStudents.splice(index, 1);
            unConnectedEmails.splice(index, 1);
            notConnected.innerHTML = "";
            drawUnconnected();
        }
    }
})

db.collection('users').doc(userId).collection("students").get().then((snapshot) => {
    let idsList = snapshot.docs;
    // console.log(idsList)
    snapshot.docs.forEach(function (doc, i) {
        if(students.includes(doc.id)){
            console.log(doc.id);
            allStudents.push(doc.data().name);
            unConnectedStudents.push(doc.data().name);
            unConnectedEmails.push(doc.data().email);
        }
        
    });
    console.log(unConnectedStudents);

    drawUnconnected();

    for(let i = 0; i<allStudents.length; i++){
        onTaskStudents.innerHTML += `<div class="studentTaskStatus">
        <div>
            <p>
            <span class="icon has-text-success">
            <i class="fas fa-circle"></i>
            </span> ` + allStudents[i] + ` 
            
            <span id="taskStatus" class="icon has-text-success">
                <i class="fas fa-check-square"></i>
            </span>
            </p>
            </div>
        </div>`;
    }
});

function drawUnconnected(){
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

//######################################################################
//######################### Asking Questions ###########################
//######################################################################

