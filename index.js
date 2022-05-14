const express = require('express');
const res = require('express/lib/response');
require('./db/conn');
const collection = require('./models/user');
const jwt = require('jsonwebtoken');
const secretKey = 'sdkfjoif89sfuoisf89e';
const pwdvalid = require('password-validator');


const app = express();
const PORT = 8000;
app.use(express.json());

app.get('/', (req, res) => {
    res.send("hello form server");
});

app.post('/register', async (req, res) => {
    var pwdSchema = new pwdvalid();

    pwdSchema
    .has().uppercase()
    .has().lowercase()
    .has().digits(1);

    if(!pwdSchema.validate(req.body.password)) {return res.status(400).send("Password should contain Upper case, Lower case and digit");}
    
    try {
        const create = new collection(req.body);
        const insert = await create.save();
        res.status(201).send(insert);
    } catch(e) {
        res.status(400).send(e);
    }
});

app.post('/login', async (req, res) => {
    try {
        const email= req.body.email;
        const password = req.body.password;

        const user = await collection.findOne({email});
        
        if(user) {
            if(user.password != password) return res.status(400).send("wrong password");
            const token = jwt.sign({
                email: user.email
            }, secretKey);

            res.status(201).send({
                user: user,
                token: token});
        } else {
            res.status(404).send("User not found");
        }
    } catch(e) {
        res.status(400).send(e);
    }
});

app.delete('/delete', (req, res) => {
    const token = req.header('x-access-token');
    try {
    jwt.verify(token, secretKey, (err, result) => {
        if(err) {res.status(400).send("Invalid token");}
        else {
            const email = result.email;
            const user = collection.findOne({email});

            if(user) {
                user.deleteOne({email}).then(res.send('User Deleted')).catch(err => res.send(err));
            } else { res.status(404).send("User not found") }
        }
    });
    }
    catch(e) {
        console.log("inside error");
        res.send(e);
    }
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});