const { Sequelize } = require('sequelize');
require("dotenv").config()

const POSTGRES_USER = process.env.POSTGRES_USER
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD
const POSTGRES_SERVER = process.env.POSTGRES_SERVER
const POSTGRES_PORT = process.env.POSTGRES_PORT // default postgres port is 5432
const POSTGRES_DB = process.env.POSTGRES_DB

const sequelize = new Sequelize(`postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_SERVER}:${POSTGRES_PORT}/${POSTGRES_DB}`,{logging:false})

module.exports = sequelize