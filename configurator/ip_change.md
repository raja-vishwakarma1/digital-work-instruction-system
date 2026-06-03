admin.html
server.js


# 🚀 PM2 Setup Documentation (Configurator Server)

## 📌 Overview

This document explains how to set up **PM2** to run your Node.js server (`server.js`) in the background and automatically start it when the system boots.

---

## 🧠 What is PM2?

PM2 is a process manager for Node.js applications. It helps to:

* Run your server in the background
* Restart automatically if it crashes
* Start automatically on system boot
* Monitor performance

---

## ⚙️ Prerequisites

* Node.js installed
* Project path:
  `C:\Users\rk916\Desktop\configurator`

---

## 🔧 Step 1: Install PM2 (Global)

Open **Command Prompt as Administrator** and run:

```
npm install -g pm2
```

Verify installation:

```
pm2 -v
```

---

## 🔧 Step 2: Enable Auto Startup (Windows)

Install startup package:

```
npm install -g pm2-windows-startup
```

Then run:

```
pm2-startup install
```

👉 This ensures PM2 starts automatically when Windows starts.

---

## 🚀 Step 3: Start Server with PM2

Navigate to your project folder:

```
cd C:\Users\rk916\Desktop\configurator
```

Start your server:

```
pm2 start server.js --name configurator-server
```

---

## 💾 Step 4: Save PM2 Process List (IMPORTANT)

```
pm2 save
```

👉 This saves the running process so it restarts automatically after reboot.

---

## 📊 Step 5: Check Status

```
pm2 list
```

Expected output:

```
configurator-server   online
```

---

## 🔄 Step 6: Test Auto Start

1. Restart your PC
2. Open CMD
3. Run:

```
pm2 list
```

✔ If status = **online**, setup is successful 🎉

---

## 🛠️ Useful Commands

### ▶ Start Server

```
pm2 start server.js --name configurator-server
```

### ⏹ Stop Server

```
pm2 stop configurator-server
```

### 🔄 Restart Server

```
pm2 restart configurator-server
```

### ❌ Delete Process

```
pm2 delete configurator-server
```

### 📜 View Logs

```
pm2 logs configurator-server
```

---

## ⚠️ Common Issue & Fix

### ❌ Error:

```
SyntaxError: Unexpected token ':'
```

### 📌 Reason:

Using:

```
pm2 start npm --name configurator-server -- start
```

👉 This runs a Windows `.cmd` file instead of your server.

### ✅ Fix:

```
pm2 start server.js --name configurator-server
```

---

## 🎯 Final Result

* Server runs in background ✅
* Auto starts on system boot ✅
* No need to manually start server ✅
* Viewer app always gets data ✅

---

## 🔥 Conclusion

Using PM2 makes your application **stable, automatic, and production-ready**. It ensures your backend is always running without manual effort.

---
