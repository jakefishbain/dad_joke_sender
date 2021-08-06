require('dotenv').config();
const nodemailer = require('nodemailer');
const fetch = require('node-fetch')

const mysql = require("mysql");
const dbConfig = require("./db.config.js");

let recipients;
// Create a connection to the database
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

const getRecipients = async () => {
  return new Promise(
    function(resolve, reject){
      connection.query(`
      SELECT * FROM recipients
      WHERE active = 1;
    `, async (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err)
      }

      if (res.length) {
        recipients = await res.map(r => r.email).join(',')
        console.log(typeof(recipients));
        console.log(recipients);
        resolve(recipients);
      }
    }
  )
});

};


const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  secure: true,
  port: 465,
  auth: {
    user: process.env.USERNAME,
    pass: process.env.PASSWORD
  },
});

const sendIt = async () => {
  await getRecipients();

  const mailOptions = {
    from: 'jake@jakefishbain.com',
    bcc: recipients,
    subject: 'Dad Joke of the Day 👴🏼'
  };

  var requestOptions = {
    method: 'GET',
    headers: { Accept: 'application/json'},
    redirect: 'follow'
  };

  await fetch("https://icanhazdadjoke.com/", requestOptions)
  .then(response => response.json())
  .then(result => {
    console.log(result)
    return result.joke
  })
  .then(joke => {
    console.log('JOKE: ', joke)
    transporter.sendMail({text: joke + '\n\n🐟', ...mailOptions}, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  })
  .catch(error => console.log('error', error));
}

sendIt();

connection.end();

// mysql> CREATE DATABASE dad_joke_sender;
// Query OK, 1 row affected (0.02 sec)

// mysql> use dad_joke_sender;
// Database changed
// mysql>
// mysql> 
// CREATE TABLE IF NOT EXISTS `recipients` (
//   id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
//   email varchar(255) NOT NULL,
//   name varchar(255) NOT NULL,
//   active BOOLEAN DEFAULT false
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
// Query OK, 0 rows affected (0.11 sec)

// mysql> SHOW TABLES;
// +---------------------------+
// | Tables_in_dad_joke_sender |
// +---------------------------+
// | recipients                |
// +---------------------------+
// 1 row in set (0.01 sec)

// jakefishbain@gmail.com, gillianschulman@gmail.com, aschulman@asdesigngroup.com, jordanarbus@gmail.com, fishbainmike@gmail.com,  miephill@gmail.com, christian.wildeman@outlook.com, trood16@gmail.com, simonmorph@gmail.com, elana.michele@gmail.com