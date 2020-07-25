//#################################################################################
//###############################  Variables ######################################
//#################################################################################
let classroomButton = document.getElementById("classroomButton");
let studentButton = document.getElementById("studentButton");
let settingsButton = document.getElementById("settingsButton");

//#################################################################################
//###############################  Html Func ######################################
//#################################################################################

classroomButton.onclick = function(){
    $(this).addClass('activePageButton');
    $("#studentButton").removeClass('activePageButton');
    $("#settingsButton").removeClass('activePageButton');
    document.getElementById("currentPage").innerHTML = "";
    $("#currentPage").load("templates/classroomPage.html");
}
$("#currentPage").load("templates/classroomPage.html");


studentButton.onclick = function(){
    $(this).addClass('activePageButton');
    $("#classroomButton").removeClass('activePageButton');
    $("#settingsButton").removeClass('activePageButton');
    document.getElementById("currentPage").innerHTML = "";
    $("#currentPage").load("templates/studentsPage.html");
}

settingsButton.onclick = function(){
    $(this).addClass('activePageButton');
    $("#studentButton").removeClass('activePageButton');
    $("#classroomButton").removeClass('activePageButton');
    document.getElementById("currentPage").innerHTML = "";
    $("#currentPage").load("templates/settingsPage.html");
}

