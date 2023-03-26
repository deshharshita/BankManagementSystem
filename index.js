const express = require('express');
const consumer = require('./services/consumer');
const balance = require('./services/balance');
const transaction = require('./services/transaction')
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const { response } = require('express');
const PORT = 5000 | process.env.PORT;


app.set('view engine','ejs');
consumer.authenticate();

app.use(bodyParser.urlencoded({extended: true}))
app.listen(PORT, ()=>{
    console.log(`Server listening at PORT : ${PORT}`);
});
app.use(express.static(__dirname + "/components/"));
app.route('/home')
    .get((req,res)=>{
        res.sendFile('components/index.html', {root: __dirname});
    })

app.route('/signup')
    .get((req,res)=>{
        res.sendFile('/components/signup.html', {root: __dirname});
    })
    .post(async (req,res)=>{
        console.log(req.body);
        await consumer.insert(req.body).then(response => text = response).catch((e)=> {console.log(e); text = {}});
        res.render('info', {currName: text.currName, currConsumerId: text.currConsumerId, currAccountNo: text.currAccountNo, currPIN: text.currPIN});
        // res.redirect('/home');
    })

app.route('/signin')
    .get((req,res)=>{
        res.sendFile('/components/signin.html', {root: __dirname})
    })
    .post(async (req,res)=>{
        console.log(req.body);
        await consumer
                .access(req.body.accountNumber, req.body.pin)
                .then(response => val = response)
        console.log(val);
        if(val.length > 1)
            res.render('error.ejs', {error: val})
        else
            res.redirect(`/account/${val[0].dataValues.accountno}+${val[0].dataValues.pin}`);
    })


//Account Open
app.route('/account/:id')
    .get((req,res)=>{
        const accountno = req.params.id.toString().split('+')[0];
        res.render('transaction', {accountno: accountno});
    })
    .post(async (req,res)=>{

        const accountno = req.params.id.toString().split('+')[0];
        let responseText = '';
        await balance.update({value: req.body.amount, accountno: accountno, method: req.body.method, destination: req.body.destination}).then(response => responseText = response);
        console.log(responseText);
        if(responseText == 'LOW BALANCE')
            res.render('error.ejs',{error: responseText});
        else if(responseText == 'Invalid Destination')
            res.render('error.ejs', {error: `${responseText} : ${req.body.destination}`})
        else{
            await transaction.insert({source: accountno, type: req.body.method, amount: req.body.amount, destination: req.body.destination}).then(response => console.log(response))
            res.redirect('/home')
        }
    })

// Get DATA
app.route('/data')
    .get(async (req,res)=>{
        await consumer.details().then(response => val = response)
        res.send(val);
    })

app.route('/transactions')
    .get(async (req,res)=>{
        let val = 'NO TRANSACTION HISTORY AVAILABLE';
        await transaction.accessAll().then(response => val = response)
        .catch(e => console.log(e));
        res.render('showTransactions', {data: val})
    })