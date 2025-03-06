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

const filteridmiddleware=(req,res,next)=>{
    if(req.params.level!=="high"&& req.params.level!=="medium" && req.params.level!=="low"){
        return  res.status(400).send("error in filter query")
}
    next()
}


module.exports={middleware,filteridmiddleware}