const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
    const win = new BrowserWindow({
        width: 1100,
        height: 750,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // Load UI
    win.loadFile("index.html");

    // Remove menu
    win.setMenu(null);

    // 🔥 IMPORTANT: send userData path (EXE + DEV both)
    win.webContents.on("did-finish-load", () => {
        win.webContents.send("user-data-path", app.getPath("userData"));
    });
}

// App ready
app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Close app
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});