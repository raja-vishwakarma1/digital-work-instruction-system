// async function upload(){

// const ass=document.getElementById("ass").value
// const step=document.getElementById("step").value
// const desc=document.getElementById("desc").value
// const img=document.getElementById("img").files[0]

// const form=new FormData()

// form.append("ass_id",ass)
// form.append("step_no",step)
// form.append("description",desc)
// form.append("image",img)

// await fetch("/upload",{
// method:"POST",
// body:form
// })

// alert("Uploaded")

// loadSteps()

// }

// async function loadSteps(){

// const ass=document.getElementById("ass").value

// const res=await fetch("/instructions/"+ass)

// const data=await res.json()

// const div=document.getElementById("steps")

// div.innerHTML=""

// data.forEach(s=>{

// div.innerHTML+=`
// <div>

// <h4>Step ${s.step_no}</h4>

// <img src="${s.image_path}" width="200">

// <p>${s.description}</p>

// </div>
// `

// })

// }

// document.getElementById("ass").addEventListener("change",loadSteps)

// loadSteps()


// const form = document.getElementById("upload-form")
// const assInput = document.getElementById("ass")
// const stepsDiv = document.getElementById("steps")

// // Upload form
// form.addEventListener("submit", async e=>{
//     e.preventDefault()
//     const ass = assInput.value
//     const step = document.getElementById("step").value
//     const desc = document.getElementById("desc").value
//     const img = document.getElementById("img").files[0]

//     const formData = new FormData()
//     formData.append("ass_id", ass)
//     formData.append("step_no", step)
//     formData.append("description", desc)
//     formData.append("image", img)

//     const res = await fetch("/upload",{ method:"POST", body: formData })
//     alert(await res.text())

//     loadSteps()
// })

// // Fetch steps
// async function loadSteps(){
//     const ass = assInput.value
//     const url = ass ? `/instructions?ass_id=${ass}` : `/instructions`
//     const res = await fetch(url)
//     const data = await res.json()

//     stepsDiv.innerHTML = ""
//     data.forEach(s=>{
//         const div = document.createElement("div")
//         div.innerHTML = `
//             <h4>Step ${s.step_no}</h4>
//             <img src="${s.image_path}" width="200">
//             <p>${s.description}</p>
//             <button onclick="deleteStep(${s.id})">Delete</button>
//             <hr>
//         `
//         stepsDiv.appendChild(div)
//     })
// }

// // Delete step
// async function deleteStep(id){
//     if(!confirm("Are you sure to delete this step?")) return
//     const res = await fetch(`/instructions/${id}`, { method:"DELETE" })
//     if(res.ok) loadSteps()
// }

// // Load on page load
// window.addEventListener("load", loadSteps)







const form = document.getElementById("upload-form")
const assInput = document.getElementById("ass")
const instructionsContainer = document.getElementById("instructions-list")

// Upload Step
form.addEventListener("submit", async e=>{
    e.preventDefault()
    const ass = assInput.value
    const step = document.getElementById("step").value
    const desc = document.getElementById("desc").value
    const img = document.getElementById("img").files[0]

    const formData = new FormData()
    formData.append("ass_id", ass)
    formData.append("step_no", step)
    formData.append("description", desc)
    formData.append("image", img)

    const res = await fetch("/upload",{ method:"POST", body: formData })
    alert(await res.text())
    fetchInstructions()
})

// Fetch Steps
async function fetchInstructions(){
    const ass = assInput.value
    const url = ass ? `/instructions?ass_id=${ass}` : `/instructions`
    const res = await fetch(url)
    const data = await res.json()

    instructionsContainer.innerHTML = ""
    data.forEach(s=>{
        const div = document.createElement("div")
        div.innerHTML = `
            <h4>Step ${s.step_no}</h4>
            <img src="${s.image_path}" width="200">



          
            <!-- <p>${s.description}</p> -->   


            <button onclick="deleteStep(${s.id})">Delete</button>
            <hr>
        `
        instructionsContainer.appendChild(div)
    })
}
//description wala code ha ushe confi pe desciption show hota ha but aabhi comment out kiya hai 7
// Delete Step
async function deleteStep(id){
    if(!confirm("Are you sure to delete this step?")) return
    const res = await fetch(`/instructions/${id}`, { method:"DELETE" })
    if(res.ok) fetchInstructions()
}

// Load all steps on page load
window.addEventListener("load", fetchInstructions)