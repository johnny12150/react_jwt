const { app, BrowserWindow } = require('electron');
const path = require("path");
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 680,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    mainWindow.loadURL(`file://${path.join(__dirname, "/build/index.html")}`);
    // mainWindow.loadURL('http://localhost:3000');

    mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});
