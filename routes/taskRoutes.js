const express=require("express")
const router=express.Router()
const {middleware,filteridmiddleware}=require("../middleware/middleware")
delete require.cache[require.resolve("../controller/taskController")];
const {getalltasks,gettaskbyid,gettaskbylevel,createtask,updateTask,deleteTask}=require("../controller/taskController")

router.get('/',getalltasks)
router.get('/:id',gettaskbyid)
router.get('/filter/:level',filteridmiddleware,gettaskbylevel)
router.post('/',middleware,createtask)
router.put('/:id',middleware,updateTask)
router.delete('/:id',deleteTask)


module.exports=router
