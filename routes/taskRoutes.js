const express=require('express')
const router=express.Router()
const {getalltasks,gettaskbyid,gettaskbylevel,createtask,updateTask,deleteTask}=require("../controller/taskController")

router.get('/',getalltasks)
router.get('/:id',gettaskbyid)
router.get('/filter/:level',filteridmiddleware,gettaskbylevel)
router.post('/',middleware,createtask)
router.put('/:id',middleware,updateTask)
router.delete('/:id',deleteTask)
module.exports=router
