//############## importing ##################

const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const isDev = require('electron-is-dev');
const log = require('electron-log');
const path = require('path');

// configure logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');
// let gitRepo = {
//   provider: "github",
//   repo: "ClassAllyPrototype",
//   owner: "sonnyloweus",
//   host: "github.com",
//   protocol: "https",
//   token: "df6663adccd3e56e73465605edc377e198afd7ab",
//   private: true,

// }
// autoUpdater.setFeedURL(gitRepo);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

//############## window ##################
let mainWindow = "";

const createWindow = () => {
  // Create the browser window.
  if (process.platform === 'darwin') {
    mainWindow = new BrowserWindow({
      width: 1000,
      height: 680,
      minWidth: 700,
      minHeight: 580,
      // transparent: true,
      webPreferences:{
        nodeIntegration: true,
      },
      icon: __dirname + '/assets/appLogo.png'
    });
  }else{
    mainWindow = new BrowserWindow({
      width: 1000,
      height: 680,
      minWidth: 700,
      minHeight: 580,
      // transparent: true,
      frame: false,

      webPreferences:{
        nodeIntegration: true,
      },
      icon: __dirname + '/assets/appLogo.png'
    });
  }

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
  if(!isDev){
    // trigger autoupdate check
    setTimeout(function restart(){
      autoUpdater.checkForUpdates();
    }, 2000)
  }
};

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

//############## updating ##################

const sendStatusToWindow = (text) => {
  log.info(text);
  if (mainWindow) {
    mainWindow.webContents.send('message', text);
  }
};

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
  sendStatusToWindow(autoUpdater.getFeedURL());
});
autoUpdater.on('update-available', info => {
  sendStatusToWindow('1');
});
autoUpdater.on('update-not-available', info => {
  sendStatusToWindow('Update not available.');
});
autoUpdater.on('error', err => {
  sendStatusToWindow(`Error in auto-updater: ${err.toString()}`);
});
autoUpdater.on('download-progress', progressObj => {
  sendStatusToWindow(
    `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred} + '/' + ${progressObj.total} + )`
  );
});
autoUpdater.on('update-downloaded', info => {
  sendStatusToWindow('2');
  setTimeout(function restart(){
    autoUpdater.quitAndInstall();
  }, 2000)
});

autoUpdater.on('error', (error)=> {
  sendStatusToWindow(error);
});