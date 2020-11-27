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
})
  