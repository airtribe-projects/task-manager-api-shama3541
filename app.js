const express = require('express');
const app = express();
const fs = require("fs");
const fspromises= require('fs').promises

const { type } = require('os');
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));




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
const parseBoolean = (value) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined; // Keeps it undefined if no valid boolean value is provided
}

// const filteridmiddleware=(req,res,next)=>{
//     if(req.params.level!=high||req.params.level!="medium"||req.params.level!="low"){
//         return  res.status(400).send("error in filter query")
// }
//     next()
// }
// function to find the index of the task with the given id
function findId(obj,Tid){
    for(let i=0;i<obj.tasks.length;i++){
        if(obj.tasks[i].id === Tid)
            return i
    }
    return -1
}
app.get('/tasks',async(req,res)=>{
    const query=parseBoolean(req.query.completed)
  try{
    const data=await fspromises.readFile("task.json","utf-8")
    const obj=JSON.parse(data)
    if (query==undefined){
        const filterobj= obj.tasks.filter((task)=>task.completed===query)
        return res.json(obj.tasks)
    }
    const filterobj= obj.tasks.sort((a,b)=>a.timestamp-b.timestamp)
    res.json(filterobj)

  }catch(error){
    res.status(500).send("Internal server error")

  }

    
   
})


app.get('/tasks/filter/:level',async(req,res)=>{
    const level=req.params.level
   try{
    const data= await fspromises.readFile("task.json","utf-8")
    const obj=JSON.parse(data)
    const filteredTasks=obj.tasks.filter((task)=>task.priority==level)
    res.json({level,filteredTasks})
    }catch(error){
       res.status(500).send("Internal server error")
    }



})


app.get('/tasks/:id',async(req,res)=>{
    const inputid = parseInt(req.params.id)
    try{
        const data= await fspromises.readFile("task.json","utf-8")
        const obj=JSON.parse(data)
        const find = findId(obj,inputid)
        if(find == -1){
            return res.status(404).send("id not found")
        }
        res.json(obj.tasks[find])

    }catch(error){
        res.status(500).send("Internal server error")
    }
     
    

})

app.post('/tasks',middleware,async (req,res)=>{
   try{
    const data= await fspromises.readFile("task.json","utf-8")
    const obj=JSON.parse(data)
    let newtaskid=1
   if(obj.tasks.length>0){
     newtaskid=obj.tasks[obj.tasks.length-1].id + 1
   }
    const newtask = {
        "id": newtaskid,
        "title": req.body.title,
        "description": req.body.description,
        "completed": req.body.completed,
        "priority": req.body.priority,
        "timestamp": Date.now()
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
        const find=findId(obj,index)
        if(find==-1){
            return res.status(404).send("id not found")
        }
        obj.tasks[find].title=req.body.title
        obj.tasks[find].description=req.body.description
        obj.tasks[find].completed=req.body.completed
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
    await fspromises.writeFile("task.json",JSON.stringify(obj))
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