const BASE_URL = "http://10.45.159.235:80";

let users = [];
let steps = [];

// ------------------ INIT ------------------
window.onload = async () => {
    loadFromLocal();     // 1. pehle local dikhao
    await syncWithServer(); // 2. fir server sync
};

// ------------------ LOAD LOCAL ------------------
function loadFromLocal() {
    const local = window.api.loadData();

    if (local) {
        users = local.users || [];
        steps = local.steps || [];

        renderUsers();
        renderSteps();
    }
}

// ------------------ SYNC SERVER ------------------
async function syncWithServer() {
    try {
        const [uRes, sRes] = await Promise.all([
            fetch(BASE_URL + "/users"),
            fetch(BASE_URL + "/instructions")
        ]);

        const serverUsers = await uRes.json();
        const serverSteps = await sRes.json();

        // 🔥 DOWNLOAD IMAGES (only if not exists)
        for (let u of serverUsers) {
            if (u.image_path) {
                const filename = u.image_path.split("/").pop();

                if (!window.api.imageExists(filename)) {
                    await window.api.saveImage(BASE_URL + u.image_path, filename);
                }
            }
        }

        for (let s of serverSteps) {
            if (s.image_path) {
                const filename = s.image_path.split("/").pop();

                if (!window.api.imageExists(filename)) {
                    await window.api.saveImage(BASE_URL + s.image_path, filename);
                }
            }
        }

        // 🔥 SAVE FULL DATA (replace old)
        const newData = {
            users: serverUsers,
            steps: serverSteps,
            lastSync: Date.now()
        };

        window.api.saveData(newData);

        // 🔥 IMPORTANT: always UI from local
        users = newData.users;
        steps = newData.steps;

        renderUsers();
        renderSteps();

        console.log("✅ Synced from server");

    } catch (err) {
        console.log("⚠️ Server OFF - using offline data");
    }
}

// ------------------ RENDER USERS ------------------
function renderUsers() {
    const container = document.getElementById("users-container");
    container.innerHTML = "";

    users.forEach(u => {
        const imgName = u.image_path?.split("/").pop();

        let imgPath = "";
        if (imgName && window.api.imageExists(imgName)) {
            imgPath = `./images/${imgName}`;
        } else {
            imgPath = BASE_URL + (u.image_path || "");
        }

        const div = document.createElement("div");
        div.className = "user-card";

        div.innerHTML = `
            <img src="${imgPath}">
            <h4>${u.name}</h4>
            <p>${u.role}</p>
        `;

        container.appendChild(div);
    });
}

// ------------------ RENDER STEPS ------------------
let stepIndex = 0;
let stepInterval;

function renderSteps() {
    if (!steps.length) return;

    clearInterval(stepInterval);

    const container = document.getElementById("steps-list");
    const img = document.getElementById("wi-image");

    function show() {
        const s = steps[stepIndex];

        const imgName = s.image_path?.split("/").pop();

        let imgPath = "";
        if (imgName && window.api.imageExists(imgName)) {
            imgPath = `./images/${imgName}`;
        } else {
            imgPath = BASE_URL + (s.image_path || "");
        }

        img.src = imgPath;

        container.innerHTML = `
            <div class="step-card">
                <strong>Step ${s.step_no}</strong><br>
                ${s.description}
            </div>
        `;
    }

    show();

    stepInterval = setInterval(() => {
        stepIndex = (stepIndex + 1) % steps.length;
        show();
    }, 30000);
}

// ------------------ AUTO SYNC ------------------
setInterval(syncWithServer, 15000);