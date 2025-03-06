const fs = require("fs");
const fspromises= require('fs').promises


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

async function getalltasks(req,res){
    try {
        const query = parseBoolean(req.query.completed);  // Get the completed filter as Boolean
        const data = await fspromises.readFile("task.json", "utf-8");
        const obj = JSON.parse(data);

        if (query !== undefined) {
            const newobj = obj.tasks.filter(task => task.completed === query);
            return res.json(newobj);  // `newobj` is already an array, no need for `.tasks`
        }

        const sortedTasks = obj.tasks.sort((a, b) => a.timestamp - b.timestamp);
        res.json(sortedTasks);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
}

    
   
// }


async function gettaskbylevel(req,res){
    const level=req.params.level
   try{
    const data= await fspromises.readFile("task.json","utf-8")
    const obj=JSON.parse(data)
    const filteredTasks=obj.tasks.filter((task)=>task.priority==level)
    res.json({level,filteredTasks})
    }catch(error){
       res.status(500).send("Internal server error")
    }



}


async function gettaskbyid(req,res){
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
     
     }

async function createtask(req,res){
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

}


async function updateTask(req,res){
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
    
}


async function deleteTask(req,res){
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
 
  
}
    

module.exports={getalltasks,updateTask,gettaskbyid,gettaskbylevel,createtask,deleteTask}