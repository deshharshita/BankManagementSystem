const { response } = require('express');
const balance = require('./balance');

const sequelize = require('./database.js').sequelize;
const DataTypes = require('./database').DataTypes;

const generateRandom = (val)=>{
    let mult = Math.pow(10,val)/10;
    return Math.floor(Math.random() * 9 * mult + mult);
}

const consumer = sequelize.define('consumer', {
    consumerid: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    dob: {
        type: DataTypes.DATE
    },
    pincode: {
        type: DataTypes.INTEGER
    },
    phone: {
        type: DataTypes.BIGINT
    },
    accountno: {
        type: DataTypes.BIGINT
    },
    pin:{
        type: DataTypes.INTEGER
    }
},{timestamps: false, freezeTableName: true})

const authenticate = ()=>{
    sequelize
        .authenticate()
        .then(()=>console.log('Connection Successfull'))
        .catch((error)=>console.log(err));
}

const insert = async (body)=>{
    balance.authenticate();
    let currConsumerId = generateRandom(9);
    let currAccountNo = generateRandom(10);
    let currPIN = generateRandom(4);
    let currName = body.name.toUpperCase();
    await consumer.create({
        consumerid: currConsumerId,
        name: currName,
        dob: body.dob,
        pincode: body.pincode,
        phone: body.phone,
        accountno: currAccountNo,
        pin: currPIN
    })
    .then(response => {console.log(response); val = {currName, currAccountNo, currConsumerId, currPIN}})
    .catch((err)=> {console.log(err); val = {}});
    balance.insert({accountno: currAccountNo, consumerid: currConsumerId});
    return val;
}

const access = async (AccountId, PIN)=>{
    await consumer.findAll({
        where: {
            accountno: AccountId,
            pin: PIN
        }
    })
    .then(response => val = response)
    .catch((err)=> val = 'INVALID CREDENTIALS');

    if(val.length === 0)
        val = "INVALID CREDENTIALS"
    return val;
}

const details = async ()=>{
    await consumer.findAll()
    .then(response => val = response)
    .catch((err)=> val = err);

    return val;
}

module.exports = {
    consumer: consumer,
    authenticate: authenticate,
    insert: insert,
    access: access,
    details: details
} 