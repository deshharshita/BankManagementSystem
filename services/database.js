const { response } = require('express');
require('dotenv').config()

const username = process.env.DB_USERNAME;
const database = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;

const {Sequelize, DataTypes} = require('sequelize')
const sequelize = new Sequelize(database, username, password,{
    host: 'localhost',
    dialect: 'postgres'
});

module.exports = {
    DataTypes: DataTypes,
    sequelize: sequelize
}