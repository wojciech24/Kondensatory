const {app, BrowserWindow} = require('electron');
const isDev = require('electron-is-dev');
require('@electron/remote/main').initialize();
function createWindow()
{
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            enableRemoteModule: true
        }
    });
    win.webContents.openDevTools();
    win.loadURL(isDev ? 'http://localhost:3000' : `file://${__dirname}/index.html`);
}
app.on('ready', createWindow);