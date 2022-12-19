const mongoose = require('mongoose');

const Task = require('./tasks-model');
const User = require('../users/users-model');

const getTasks = async (_, res, next) => {
  // const tasks = await Task.find().exec();
  res.json({
    test: "works"
  });
};

const getTaskById = async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  res.json({ task: task.toObject({ getters: true }) });
}

const createTask = async (req, res, next) => {
  const task = req.body;
  task.user = req.userData.userId;
  const user = await User.findById(task.user)
  const createdTask = new Task(task);

  const session = await mongoose.startSession();
  session.startTransaction();

  await createdTask.save({ session });
  user.tasks.push(createdTask);
  await user.save({ session });
  
  await session.commitTransaction();

  res.status(201).json({ task: createdTask });
};

const updateTask = async (req, res, next) => {
  const { id } = req.params;

  const updatedTask = await Task.findById(id);
  updatedTask.name = req.body.name;
  updatedTask.status = req.body.status;
  updatedTask.description = req.body.description;
  await updatedTask.save();
  res.json( {task: updatedTask.toObject({ getters: true }) });
}

const deleteTask = async (req, res, next) => {
  const { id } = req.params;
  
  const deletedTask = await Task.findById(id).populate('user');

  if (!deletedTask) return next( newHttpError('Could not find task fot this id', 404));

  const session = await mongoose.startSession();
  session.startTransaction();

  await deletedTask.remove({ session });
  deletedTask.user.tasks.pull(deletedTask);
  await deletedTask.user.save({ session });
  
  await session.commitTransaction();
  
  res.json( {message: 'Task deleted' });
}

exports.getTasks = getTasks;
exports.getTaskById = getTaskById;
exports.createTask = createTask;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask