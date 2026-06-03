const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");

let DATA_FILE = "";
let IMAGE_DIR = "";

// detect mode
const isDev = process.env.NODE_ENV === "development";

// receive path from main (for EXE)
ipcRenderer.on("user-data-path", (event, userPath) => {

    if (isDev) {
        // 🔥 DEV MODE (VS CODE)
        DATA_FILE = path.join(__dirname, "data/db.json");
        IMAGE_DIR = path.join(__dirname, "images");
    } else {
        // 🔥 EXE MODE
        DATA_FILE = path.join(userPath, "db.json");
        IMAGE_DIR = path.join(userPath, "images");
    }

    // create folders if not exist
    if (!fs.existsSync(path.dirname(DATA_FILE))) {
        fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    }

    if (!fs.existsSync(IMAGE_DIR)) {
        fs.mkdirSync(IMAGE_DIR);
    }
});

contextBridge.exposeInMainWorld("api", {

    saveData: (data) => {
        if (!DATA_FILE) return;
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    },

    loadData: () => {
        if (!DATA_FILE || !fs.existsSync(DATA_FILE)) return null;
        return JSON.parse(fs.readFileSync(DATA_FILE));
    },

    saveImage: async (url, filename) => {
        if (!IMAGE_DIR) return;

        const fetch = require("node-fetch");
        const res = await fetch(url);
        const buffer = await res.buffer();

        const filePath = path.join(IMAGE_DIR, filename);
        fs.writeFileSync(filePath, buffer);

        return filePath;
    },

    imageExists: (filename) => {
        if (!IMAGE_DIR) return false;
        return fs.existsSync(path.join(IMAGE_DIR, filename));
    }
});