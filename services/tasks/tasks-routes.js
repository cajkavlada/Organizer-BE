const { Router } = require("express");

const tasksControllers = require("./tasks-controllers");

const router = Router();

router.get("/", tasksControllers.getTasks);
router.get("/:id", tasksControllers.getTaskById);
router.post("/", tasksControllers.createTask);
router.patch("/:id", tasksControllers.updateTask);
router.delete("/:id", tasksControllers.deleteTask);


module.exports = router;
