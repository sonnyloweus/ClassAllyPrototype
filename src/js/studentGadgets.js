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
    console.log(inputSources);
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
}, 20000);
