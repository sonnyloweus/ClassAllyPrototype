let joinClass = document.getElementById("joinClass");
let studentEmail = document.getElementById("studentEmail").value;
let studentName = document.getElementById("studentName").value;
let classZoomId = document.getElementById("classZoomId").value;
let errorMessageJoin = document.getElementById("errorMessageJoin");

joinClass.onclick = function(){
    studentEmail = document.getElementById("studentEmail").value;
    studentName = document.getElementById("studentName").value;
    classZoomId = document.getElementById("classZoomId").value;

    if(studentEmail == ""){
        errorMessageJoin.innerHTML = "*Please put in an email";
    }else{
        if(studentName == ""){
            errorMessageJoin.innerHTML = "*Please put in a name";
        }else{
            rtdb.ref('ChatRooms/' + classZoomId).once("value", snapshot => {
                if (snapshot.exists()){
                    remote.BrowserWindow.getFocusedWindow().minimize();
                    let meetingInfo = {
                        "studentEmail": studentEmail,
                        "studentName": studentName,
                        "classroomId" : classZoomId,
                    }
                    let allInfoURL = new URLSearchParams(meetingInfo).toString();
                    // console.log(allInfoURL);
                    studentEmail = "";
                    studentName = "";
                    classZoomId = "";
                    let popup = window.open(
                        "templates/studentMeetingPopup.html?" + allInfoURL, "Controls",
                        "height=380,width=300,modal=yes,alwaysRaised=yes,minWidth=300,minHeight=620");
                    popup.focus();

                }else{
                    errorMessageJoin.innerHTML = "*Cannot find a classroom";
                }
             });
        }
    }
    
}
