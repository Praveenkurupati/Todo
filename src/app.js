const express = require('express');
const jwt = require('jsonwebtoken');
const sequelize = require('./Db_connection/config');
const cors = require('cors');
require('dotenv').config();

const {User,Todo} = require('./models/Db_schemas')


const app = express();
app.use(cors());

// Middleware to parse request body as JSON
app.use(express.json());

const UserManagement = require("./Routes/UserManagement")
const TodoManagement = require("./Routes/TodoManagement")
const CategoryManagement = require("./Routes/CategoryManagement")

app.use('/',UserManagement)
app.use('/',TodoManagement)
app.use('/',CategoryManagement)


sequelize
  .authenticate()
  .then(() => console.log('DB is connected'))
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });

  (async () => {
    try {
      await sequelize.sync();
      // await roles.sync();
      console.log('Sequelize synchronization completed.');
    } catch (error) {
      console.error('Sequelize synchronization failed:', error.message);
    }
  })();

module.exports = app;