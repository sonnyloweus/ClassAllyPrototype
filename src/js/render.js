//#################################################################################
//#######################@####  Custom TitleBar  ############@#####################
//#################################################################################
//npm i custom-electron-titlebar
const customTitlebar = require('custom-electron-titlebar');
const {Menu} = require('electron').remote;

// setTimeout(function() {
//     $(".overlay").fadeOut(500);
//     document.getElementById("header").style.display = "block";
// }, 2500);

let menuTemplate = Menu.buildFromTemplate([
    {
        label: 'View',
            submenu: [
            { label:'Minimize', 
                role:"minimize"
            },
            { label:'Close', 
                role:"close"
            },
            { label:'Reload', 
                role:"reload"
            },
            { label:'Force Reload', 
                role:"forceReload"
            }
        ]
    }
  ])

new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#444'),
    overflow: "hidden",
    menu: menuTemplate,
    // icon: './assets/timerIcon-full.png',
});

let titleBarTitle = document.querySelector('.window-title');
titleBarTitle.innerHTML = "Welcome to your API Tester";
