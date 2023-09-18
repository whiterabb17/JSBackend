const sqlite3 = require('sqlite3').verbose();
const ffs = require('fs');


var DATA;

function GetAll(path){
    var tableData = []
    let db = new sqlite3.Database(process.cwd() + "/backend.db");
    // let sql = `SELECT * FROM clients`;
    db.serialize(async function(){
        db.each("SELECT * FROM users", function(err, row) {
            tableData.push(row);
            console.log("TABLE DATA")
            console.log(tableData)
            db.close();   
            return tableData;
        });
    });
    db.close();   
    // close the database connection 
}

function GetItem(query, item) {
    // let sql = `SELECT *
    //        FROM ` + table + `
    //        WHERE ` + coloum + `  = ?`;

    // first row only
    let db = new sqlite3.Database(MainPath);
    db.get(query, [item], (err, row) => {
    if (err) {
        return console.error(err.message);
    }
    return row
        ? console.log(row)
        : console.log(`No items found querying ${item}`);

    });

    // close the database connection
    db.close();
}

function GetRows(query, item){
    let db = new sqlite3.Database(MainPath);
    db.each(query, [item], (err, row) => {
        if (err) {
            throw err;
        }
        console.log(`${row.firstName} ${row.lastName} - ${row.email}`);
    });

    // close the database connection
    db.close();
}

var MainPath;

function CreateMainTable(){
    //console.log(path)
    MainPath = process.cwd() + "\\backend.db";
   // if (!ffs.existsSync(path + '/logs/solstice.db')) {
        let db = new sqlite3.Database(MainPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
              console.error(err.message);
            }
            console.log('Connected to the Solstice database.');
        });
        let cquery = `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            firstName TEXT NOT NULL UNIQUE,
            lastName TEXT NOT NULL,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            permissionLevel INTERGER NULL
        );`;
        db.run(cquery, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log("Created!")
            }
        });
        db.close();
   // } else {
   //     MainPath = path + '/internals/logs/solstice.db';
   //     console.log(MainPath)
   // }    
}
function CheckIfUserExists(email, password) {
    console.log(email);
    console.log(password);
    let db = new sqlite3.Database(process.cwd() + "/backend.db");
    let check = `SELECT email FROM users WHERE email = ?`
    let cpass;
    db.get(check, email, (err, row) => {
        if (err) {
            console.log(err);
            let pc = `SELECT password FROM users WHERE email = ?`
            db.get(pc, email, (err, row) => {
                if (err) {
                    return false;
                } else {
                    console.log(row);
                    var dpass = row; //fb64(row);
                    if (dpass == password) {
                        return true;
                    }
                }
            })
        }
    });
}
function fb64(encData){
	'use strict'
	let buff = new Buffer.from(encData, "base64");
	let text = buff.toString('ascii');
	return text;
}
function InsertNewUser(fName, lName, email, password, permissionLevel){
    //console.log(dataArray)
    //console.log(path)
    let db = new sqlite3.Database(process.cwd() + "/backend.db");
    let check = `SELECT email FROM users WHERE email = ?`
    db.get(check, email, (err, row) => {
        if (err) {
            exists = true
            console.log(row)
            console.log("Username already exists, please select a new one")
        } else {
            exists = false
            var stmt = db.prepare(`INSERT INTO users VALUES (?,?,?,?,?,?)`);
            stmt.run(null, fName, lName, email, password, permissionLevel);
            stmt.finalize();
        }
    });
    db.close();
}

module.exports = {
    GetAll,
    GetItem,
    GetRows,
    CreateMainTable,
    InsertNewUser,
    CheckIfUserExists
//    Udb
}