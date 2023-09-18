const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
var _workDir = process.cwd();
var formidable = require('formidable');
const { Database } = require('sqlite3');
var form = new formidable.IncomingForm();
const app = express();
const port = 3000;
// Local Javascript
var dataBase = require(_workDir + '/utils/db.js');
// End Local

// Where we will keep books
let users = [];
dataBase.CreateMainTable(process.cwd() + '/backend.db');

function loadNewPage(res){
    res.sendFile(process.cwd() + '/html/login.html');
}

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/reg', (req, res) => {
    var rbody = req.body;
    const user = rbody;
    console.log(user);
    users.push(user);
    dataBase.InsertNewUser(user.firstName, user.lastName, user.email, user.password, 1);
    res.send("Registration was successful");
    loadNewPage(res);
});


app.post('/checkUser', (req, res) => {
    const cuser = req.body;
    let unmae = cuser.email;
    let upass = cuser.password;
    if (dataBase.CheckIfUserExists(unmae, upass)) {
        res.send("User Exists and Password was Correct");
    }
})

app.get('/', (req, res) => {
    res.sendFile(_workDir + '/html/reg.html');
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));