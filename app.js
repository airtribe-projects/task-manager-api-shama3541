const express = require('express');
const app = express();
const fs = require("fs");
const fspromises= require('fs').promises

const { type } = require('os');
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function timeStamp(){const now = new Date();
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()
    // Example usage:
    return (hours+(minutes/10)+(seconds/100))


}


const middleware=(req,res,next)=>{
    const title=req.body.title
    const description=req.body.description
    const completed=req.body.completed
    if(typeof(completed)!="boolean"){
        return res.status(400).send("error with input 1")
    }
    if(title==undefined || title==""){
        return res.status(400).send("input error in title")
    }
    if(description==undefined || description ==""){
        return res.status(400).send("error in description input")
    }
    next()
}
function findId(obj,Tid){
    for(let i=0;i<obj.tasks.length;i++){
        if(obj.tasks[i].id === Tid)
            return i
    }
    return -1
}
app.get('/tasks',async(req,res)=>{
    const query=req.query.completed
  try{
    const data=await fspromises.readFile("task.json","utf-8")
    const obj=JSON.parse(data)
    res.json(obj.tasks)

  }catch(error){
    res.status(500).send("Internal server error")

  }

    
   
})




app.get('/tasks/:id',async(req,res)=>{
    const inputid = parseInt(req.params.id)
    try{
        const data= await fspromises.readFile("task.json","utf-8")
        const obj=JSON.parse(data)
        if(inputid>obj.tasks.length){
            return res.status(404).send("id not found")
        }
        res.json(obj.tasks[inputid-1])

    }catch(error){
        res.status(500).send("Internal server error")
    }
     
    

})

app.post('/tasks',middleware,async (req,res)=>{
   try{
    const data= await fspromises.readFile("task.json","utf-8")
    const obj=JSON.parse(data)
    const newtaskid=obj.tasks[obj.tasks.length-1].id
    const newtask = {
        "id": newtaskid,
        "title": req.body.title,
        "description": req.body.description,
        "completed": req.body.completed,
        "timestamp": parseFloat(timeStamp().toFixed(2))
     }
     obj.tasks.push(newtask)
     await fs.writeFileSync("task.json",JSON.stringify(obj))
     res.status(201).send("Created todo")
   }
    catch(error){
        res.status(500).send("Internal server error")
    }

})
app.put('/tasks/:id',middleware,async(req,res)=>{
    try{
        const data=await fspromises.readFile("task.json","utf-8")
        const obj=JSON.parse(data)
        const index=parseInt(req.params.id)
        if(index>obj.tasks.length){
            return res.status(404).send("id not found")
        }
        obj.tasks[index].title=req.body.title
        obj.tasks[index].description=req.body.description
        obj.tasks[index].completed=req.body.completed
        fs.writeFileSync("task.json",JSON.stringify(obj))
        res.send("Updated task successfully")
    }catch(error){
        res.status(500).send("Internal server error")
    }
    
})


app.delete('/tasks/:id',async (req,res)=>{
  const delid=parseInt(req.params.id)
  try{
    const data=await fspromises.readFile("task.json","utf-8")
    const obj=JSON.parse(data)
    const index=findId(obj,delid)
    if(index==-1){
        return res.status(404).send("id not found")
    }
    obj.tasks=obj.tasks.filter((task)=>task.id!=delid)
    fs.writeFileSync("task.json",JSON.stringify(obj))
    res.send("Deleted successfully")
  }catch(error){
      res.status(500).send("Internal server error")
  }
 
  
})
    


app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;