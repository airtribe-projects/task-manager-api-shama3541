const express = require('express');
const app = express();
const fs = require("fs");
const { type } = require('os');
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const middleware=(req,res,next)=>{
    const title=req.body.title
    const description=req.body.description
    const completed=req.body.completed
    if(typeof(completed)!="boolean"){
        return res.status(400).send("error with input")
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
app.get('/tasks',(req,res)=>{
fs.readFile("task.json","utf-8",(err,data)=>{
    const obj= JSON.parse(data)
    res.json(obj.tasks)
})

})


app.get('/tasks/:id',(req,res)=>{
    const inputid = parseInt(req.params.id)
    fs.readFile("task.json","utf-8",(err,data)=>{
     if(err){
        return res.send("Issue reading file ")
     }
     const obj2 = JSON.parse(data)
     const checkid=findId(obj2,inputid)
     if(checkid == -1){
        return res.status(404).send("id not found")
     }
      res.json(obj2.tasks[checkid])        
    })
    

})

app.post('/tasks',middleware,(req,res)=>{
    fs.readFile("task.json","utf-8",(err,data)=>{
        if(err){
            return res.send("error reading file")
        }
     const obj = JSON.parse(data)
     const newtaskid=obj.tasks.length
     const newtask = {
        "id": newtaskid+1,
        "title": req.body.title,
        "description": req.body.description,
        "completed": req.body.completed
     }
     obj.tasks.push(newtask)
     fs.writeFile("task.json",JSON.stringify(obj),(err)=>{
        if(err){
            return res.send("error")
        }
        res.status(201).send("Created todo")
     })

    })
})
app.put('/tasks/:id',middleware,(req,res)=>{
    const getid=parseInt(req.params.id)
    fs.readFile("task.json","utf-8",(err,data)=>{
        if(err){
            return res.send("error reading file")
        }
     const obj = JSON.parse(data)
     const findIdx= findId(obj,getid)
     if(findIdx ==-1){
        return res.status(404).send("id not found")
     }
       obj.tasks[findIdx].title=req.body.title
       obj.tasks[findIdx].description=req.body.description
       obj.tasks[findIdx].completed=req.body.completed
     fs.writeFile("task.json",JSON.stringify(obj),(err)=>{
        if(err){
            return res.send("error")
        }
        res.send("Updated todo")
     })

    })
    
})


app.delete('/tasks/:id',(req,res)=>{
  const delid=parseInt(req.params.id)
  fs.readFile('task.json','utf-8',(err,data)=>{
    const obj= JSON.parse(data)
    const checkid=findId(obj,delid)
    if(checkid == -1){
        return res.status(404).send("id not found")
    }
    obj.tasks=obj.tasks.filter((element)=>element.id!=delid)
    fs.writeFile('task.json',JSON.stringify(obj),(err)=>{
        if(err){
           return  res.status(500).send("Issue writing to the file")
        }
        res.send("Deleted task successfully")
    })
  }
)
})
    


app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;