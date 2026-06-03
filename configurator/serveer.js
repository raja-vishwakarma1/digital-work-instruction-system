// const express = require("express")
// const multer = require("multer")
// const cors = require("cors")
// const session = require("express-session")
// const { Pool } = require("pg")
// const path = require("path")
// const fs = require("fs")

// const app = express()
// const PORT = 3000

// // ----------------- Middleware -----------------
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// app.use(cors())
// app.use(express.static("public"))
// app.use("/uploads", express.static("uploads"))

// // Session setup (optional, for future production)
// app.use(session({
//     secret: "config_secret",
//     resave: false,
//     saveUninitialized: true
// }))

// // ----------------- PostgreSQL Connection -----------------
// const pool = new Pool({
//     user: "postgres",
//     host: "localhost",
//     database: "configurator",
//     password: "12345",  // apna password yahan daalo
//     port: 5432
// })

// // ----------------- Multer Setup -----------------
// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, "uploads/")
//     },
//     filename: function(req, file, cb){
//         cb(null, Date.now() + path.extname(file.originalname))
//     }
// })
// const upload = multer({ storage })

// // ----------------- Routes -----------------

// // Upload Step
// app.post("/upload", upload.single("image"), async (req,res)=>{
//     try{
//         const { ass_id, step_no, description } = req.body

//         // File check
//         if(!req.file) return res.status(400).send("No file uploaded")

//         const image_path = "/uploads/" + req.file.filename
//         const step_no_int = parseInt(step_no) // ensure integer

//         await pool.query(
//             "INSERT INTO work_instructions (ass_id, step_no, description, image_path) VALUES ($1,$2,$3,$4)",
//             [ass_id, step_no_int, description, image_path]
//         )

//         res.send("Upload Success")
//     }catch(e){
//         console.error(e)   // Exact DB error console me dikhega
//         res.status(500).send("DB Insert Error")
//     }
// })

// // Fetch Instructions by ASS
// app.get("/instructions/:ass", async (req,res)=>{
//     const ass = req.params.ass
//     try{
//         const result = await pool.query(
//             "SELECT * FROM work_instructions WHERE ass_id=$1 ORDER BY step_no",
//             [ass]
//         )
//         res.json(result.rows)
//     }catch(e){
//         console.error(e)
//         res.status(500).send("DB Fetch Error")
//     }
// })

// // Delete Step
// app.delete("/instructions/:id", async (req,res)=>{
//     const id = req.params.id
//     try{
//         const result = await pool.query(
//             "SELECT image_path FROM work_instructions WHERE id=$1",
//             [id]
//         )
//         if(result.rows.length>0){
//             const imgPath = "." + result.rows[0].image_path
//             if(fs.existsSync(imgPath)) fs.unlinkSync(imgPath)
//         }

//         await pool.query("DELETE FROM work_instructions WHERE id=$1", [id])
//         res.send("Deleted Successfully")
//     }catch(e){
//         console.error(e)
//         res.status(500).send("DB Delete Error")
//     }
// })

// // ----------------- Start Server -----------------
// app.listen(PORT, ()=>console.log(`Server running http://localhost:${PORT}`))








const express = require("express")
const multer = require("multer")
const cors = require("cors")
const session = require("express-session")
const { Pool } = require("pg")
const path = require("path")
const fs = require("fs")

const app = express()

//port change kar raha hu aabhi thoda sa
//const PORT = 3000
const PORT = 80 //yah new ha port jo main use kar raha hu, aap apne hisab se change kar sakte ho, lekin 80 port pe run karne ke liye admin rights chahiye hote hain, toh agar aapko permission error aaye toh ya toh port change kar do ya phir terminal ko admin mode me run karo.

// Middleware
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

// PostgreSQL connection
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "configurator",
    password: "12345",  // apna password
    port: 5432
})

// Multer setup
const storage = multer.diskStorage({
    destination: (req,file,cb) => cb(null, "uploads/"),
    filename: (req,file,cb) => cb(null, Date.now() + path.extname(file.originalname))
})
const upload = multer({ storage })

// ----------------- Routes -----------------

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

















// Fetch Instructions (all or by ass_id)
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

// Start server
//app.listen(PORT, ()=>console.log(`Server running http://localhost:${PORT}`)) port change kar raha hu aabhi thoda sa 
app.listen(PORT, () => {
    console.log("Server running at http://rajadc.local")
})