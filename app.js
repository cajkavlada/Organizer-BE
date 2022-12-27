const mongoose = require('mongoose');
const express = require("express");
const bodyParser = require('body-parser');

const checkAuth = require("./middleware/check-auth");
const tasksRoutes = require("./services/tasks/tasks-routes");
const usersRoutes = require('./services/users/users-routes');
const errors = require("./util/error-handlers");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
})

app.use('/api/users', usersRoutes);

// app.use(checkAuth);
app.use('/api/tasks', tasksRoutes);

app.use(errors.unknownRouteError);
app.use(errors.defaultError);

mongoose
  .connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ql0cuax.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
  .then(() => {
    console.log('..........................HERE WORKING .....................................');
    app.listen(process.env.PORT || 5000);
  })
  .catch(err => { 
    console.log('..........................HERE NOT WORKING .....................................');
    console.log(err);
  });
  