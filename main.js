/**
 * Created by roots on 2017/7/7.
 */
'use strict';
const electron = require('electron');
const app = electron.app;
const browserWindow = electron.BrowserWindow;
let mainWindow;
function createWindow() {
    mainWindow = new browserWindow({width: 800, height: 600});
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    //开发调试工具
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed',function () {
        mainWindow = null;
    });
}
app.on('ready',createWindow);
app.on('window-all-closed',function () {
    if (process.platform !== 'darwi') {
      app.quit();
    }
})
app.on('activate',function () {
    if (mainWindow == null) {
      createWindow();
    }
})