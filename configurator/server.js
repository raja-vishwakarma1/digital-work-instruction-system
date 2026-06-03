const express = require("express")
const multer = require("multer")
const cors = require("cors")
const session = require("express-session")
const { Pool } = require("pg")
const path = require("path")
const fs = require("fs")

const app = express()

// Port setup
const PORT = 80 // agar permission error aaye toh change kar do

// ----------------- Middleware -----------------
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static("public"))
app.use("/uploads", express.static("uploads"))

// Session (optional)
app.use(session({
    secret: "config_secret",
    resave: false,
    saveUninitialized: true
}))

// ----------------- PostgreSQL Connection -----------------
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "configurator",
    password: "12345",
    port: 5432
})

// ----------------- Multer Setup -----------------
const storage = multer.diskStorage({
    destination: (req,file,cb) => cb(null, "uploads/"),
    filename: (req,file,cb) => cb(null, Date.now() + path.extname(file.originalname))
})
const upload = multer({ storage })

// ----------------- Routes -----------------

// ----- Work Instructions -----
// Upload Step
app.post("/upload", upload.single("image"), async (req,res)=>{
    try{
        const { ass_id, step_no, description } = req.body
        if(!req.file) return res.status(400).send("No file uploaded")
        const stepInt = parseInt(step_no)
        const image_path = "/uploads/" + req.file.filename

        await pool.query(
            "INSERT INTO work_instructions (ass_id,step_no,description,image_path) VALUES ($1,$2,$3,$4)",
            [ass_id, stepInt, description, image_path]
        )

        res.send("Upload Success")
    }catch(e){
        console.error(e)
        res.status(500).send("DB Insert Error")
    }
})

// Fetch Instructions
app.get("/instructions", async (req,res)=>{
    try{
        const ass = req.query.ass_id
        let query = "SELECT * FROM work_instructions"
        let params = []

        if(ass){
            query += " WHERE ass_id=$1"
            params.push(ass)
        }

        query += " ORDER BY step_no"

        const result = await pool.query(query, params)
        res.json(result.rows)
    }catch(e){
        console.error(e)
        res.status(500).send("DB Fetch Error")
    }
})

// Delete Step
app.delete("/instructions/:id", async (req,res)=>{
    const id = req.params.id
    try{
        const result = await pool.query("SELECT image_path FROM work_instructions WHERE id=$1",[id])
        if(result.rows.length>0){
            const imgPath = "." + result.rows[0].image_path
            if(fs.existsSync(imgPath)) fs.unlinkSync(imgPath)
        }

        await pool.query("DELETE FROM work_instructions WHERE id=$1",[id])
        res.send("Deleted Successfully")
    }catch(e){
        console.error(e)
        res.status(500).send("DB Delete Error")
    }
})

// ----- Users Management -----
// Fetch all users
app.get("/users", async (req,res)=>{
    try{
        const result = await pool.query("SELECT * FROM users ORDER BY id DESC");
        res.json(result.rows);
    }catch(e){
        console.error(e);
        res.status(500).send("DB Fetch Users Error");
    }
});

// Add new user
app.post("/users", upload.single("image"), async (req,res)=>{
    try{
        const { name, role } = req.body;
        let image_path = null;

        if(req.file){
            image_path = "/uploads/" + req.file.filename;
        }

        const result = await pool.query(
            "INSERT INTO users(name, role, image_path) VALUES($1,$2,$3) RETURNING *",
            [name, role, image_path]
        );

        res.json(result.rows[0]);
    }catch(e){
        console.error(e);
        res.status(500).send("DB Insert User Error");
    }
});

// Update user
app.put("/users/:id", upload.single("image"), async (req,res)=>{
    try{
        const { id } = req.params;
        const { name, role } = req.body;

        let query = "UPDATE users SET name=$1, role=$2";
        let params = [name, role];

        if(req.file){
            const image_path = "/uploads/" + req.file.filename;
            query += ", image_path=$3";
            params.push(image_path);
        }

        query += " WHERE id=$" + (params.length + 1) + " RETURNING *";
        params.push(id);

        const result = await pool.query(query, params);
        res.json(result.rows[0]);
    }catch(e){
        console.error(e);
        res.status(500).send("DB Update User Error");
    }
});

// Delete user
app.delete("/users/:id", async (req,res)=>{
    try{
        const { id } = req.params;

        // Delete image if exists
        const userResult = await pool.query("SELECT image_path FROM users WHERE id=$1",[id]);
        if(userResult.rows.length>0){
            const imgPath = "." + userResult.rows[0].image_path;
            if(fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }

        await pool.query("DELETE FROM users WHERE id=$1",[id]);
        res.send("User Deleted Successfully");
    }catch(e){
        console.error(e);
        res.status(500).send("DB Delete User Error");
    }
});

// ----------------- Start server -----------------
// app.listen(PORT, () => {
//     console.log("Server running at http://rajadc.local")

// })

// port change kar raha hu aabhi thoda sa date 28/6/2024 ko kyu ki me viewer bana rsha hu esh liya yah sahi ha  last change 28/6/2024 ko kiya tha

app.listen(PORT, "0.0.0.0", () => {
   console.log(`Server running at http://10.45.159.235:${PORT}`)  // yah ip address change karna padega apne system ke hisab se
})

// DATE: 28/6/2024

