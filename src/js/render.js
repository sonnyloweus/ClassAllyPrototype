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
    overflow: "display"
    // menu: menuTemplate,
    // icon: './assets/timerIcon-full.png',
});

let titleBarTitle = document.querySelector('.window-title');
titleBarTitle.innerHTML = "";

// <img style='margin-top: 50px' width='150px' src='assets/largeLogo.png'>
// titlebar.updateIcon('../assets/largeLogo.png');

// let windowIcons = document.querySelector('.window-controls-container');
// let windowMinimize = document.getElementsByClassName('window-icon-bg')[0];
// let windowMaximize = document.getElementsByClassName('window-icon-bg')[1];
// let windowClose = document.getElementsByClassName('window-icon-bg')[2];

// windowMinimize.style.borderRadius = "50%";
// // windowMinimize.style.marginLeft = "10px";
// windowMinimize.style.marginTop = "5px";
// windowMinimize.style.height = "30px";
// windowMinimize.style.width = "30px";

// windowMinimize.innerHTML = `

//     <span class="icon ">
//         <i style="color: black;" class="fas fa-minus-square"></i>
//     </span>
// `;

// windowMaximize.style.borderRadius = "50%";
// // windowMaximize.style.marginLeft = "10px";
// windowMaximize.style.marginTop = "5px";
// windowMaximize.style.height = "30px";
// windowMaximize.style.width = "30px";

// windowMaximize.innerHTML = `
//     <span class="icon">
//         <i style="color: black;" class="fas fa-expand"></i>
//     </span>
// `;

// windowClose.style.borderRadius = "50%";
// // windowClose.style.marginLeft = "10px";
// windowClose.style.marginRight = "10px";
// windowClose.style.marginTop = "5px";
// windowClose.style.height = "30px";
// windowClose.style.width = "30px";

// windowClose.innerHTML = `
//     <span class="icon">
//         <i style="color: black;" class="fas fa-times-circle"></i>
//     </span>
// `;

    // <div class="window-icon-bg">
    //     <div class="window-icon window-minimize">
    //     </div>
    // </div>
        
    // <div class="window-icon-bg">
    //     <div class="window-icon window-max-restore window-maximize">
    //     </div>
    // </div>
                
    // <div class="window-icon-bg window-close-bg">
    //     <div class="window-icon window-close">
    //     </div>
    // </div>