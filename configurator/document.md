node server.js se server run hota ha aar yah 

pgadmin me yah command use hua ha aabhi 

=================== RAJA VISHWAKARMA===============
Table create
CREATE TABLE work_instructions (
id SERIAL PRIMARY KEY,
ass_id VARCHAR(50),
step_no INT,
description TEXT,
image_path TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);






============================ PATH CHECK ===============

1️⃣ Tables check karo
\d
Ye tumhe sab tables dikhayega. Tumhare case me:
work_instructions
Agar table dikh raha hai, matlab sab sahi create hua ✅
2️⃣ Table ka data dekhna
SELECT * FROM work_instructions;
Ye tumhe sab uploaded steps aur unke image_path dikhayega


=============================== DATA 26-03-2026=====





=================== rajadc.local how to stepup ========



1️⃣ Hosts file location aur extension check karo

File ka path:

C:\Windows\System32\drivers\etc\hosts
Make sure file ka name exactly hosts hai, koi .txt extension nahi hona chahiye.
File type All Files select karke open karo, .txt nahi.


2️⃣ Hosts file me correct entry ho

File end me ye line ho:

127.0.0.1       rajadc.local --> yah main ha 



Space ya tab ek ya do hone chahiye, unnecessary characters na ho


=============================

Save karne ke liye Notepad as Administrator use karo
How to run Notepad as Admin
Start Menu → Notepad search
Right Click → Run as Administrator
File → Open → path paste karo
File type: All Files
Edit & Save
3️⃣ DNS cache flush karo

Admin PowerShell / CMD me run karo:

ipconfig /flushdns
Ye Windows DNS cache clear karega, taaki naya rajadc.local read ho
4️⃣ Ping test

Ab run karo:

ping rajadc.local
====================





=======user add database command ===================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    image_path TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
/uploads folder dono work instructions aur users images ke liye use ho raha hai.
Tum ab add / edit / delete / fetch users aur work instructions dono ke liye ready ho.