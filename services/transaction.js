const { response } = require('express');
const database = require('./database.js');

const sequelize = require('./database.js').sequelize;
const DataTypes = require('./database').DataTypes;

const generateRandom = (val)=>{
    let mult = Math.pow(10,val)/10;
    return Math.floor(Math.random() * 9 * mult + mult);
}

const getDate = ()=>{
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = date.getMonth();
    let dd = date.getDate();

    if(dd < 10)
        dd = '0'+ dd;

    return yyyy+'-'+mm+'-'+dd;
}

const authenticate = ()=>{
    sequelize
        .authenticate()
        .then(()=>console.log('Connection Successfull'))
        .catch((error)=>console.log(err));
}


const transaction = sequelize.define('transaction', {
    transactionid: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    sourceaccount: {
        type: DataTypes.BIGINT
    },
    type: {
        type: DataTypes.STRING
    },
    date: {
        type: DataTypes.DATE
    },
    amount: {
        type: DataTypes.INTEGER
    },
    destination: {
        type: DataTypes.BIGINT
    }
}, {timestamps: false, freezeTableName: true});

const insert = async (body)=>{
    await transaction.create({
        transactionid: generateRandom(7),
        sourceaccount: body.source,
        type: body.type,
        date: getDate(),
        amount: body.amount,
        destination: body.destination
    })
    .then(response => console.log(response))
    .catch(e => console.log(e))
}

const accessAll = async ()=>{
    authenticate();
    let val1 = "";
    await transaction.findAll()
        .then(response => val1 = response)
        .catch(e => console.log(e))
    console.log('val1');
    return val1;
}

module.exports = {
    authenticate: authenticate,
    transaction: transaction,
    insert: insert,
    accessAll: accessAll
}