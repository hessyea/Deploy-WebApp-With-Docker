const webpush = require('web-push');
var http = require('http');
const express = require('express');
const app = express();

require('dotenv').config();
const { Client } = require('pg');
var bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// VAPID keys should be generated only once.
app.use(express.static('fold22'));
app.listen(8080, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port");
});
var PUB_KEY22 = "";
var PRIV_KEY22 = "";
if (process.env.RUN_TIMES == 0){
  var vapidKeys = webpush.generateVAPIDKeys();
  PUB_KEY22 = vapidKeys.publicKey;
  PRIV_KEY22 = vapidKeys.privateKey;
  console.log("done VAPI_KEYS");
}
/*
app.get('/tst', function(req, res){
 handle22(req, res);
});*/
async function handle26(klient_data){
  const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    ssl: true,
  });
  await client.connect();
  let createTableQuery = `
    CREATE TABLE IF NOT EXISTS klient(
      id BIGSERIAL PRIMARY KEY NOT NULL ,
      klient_key varchar,
      date TIMESTAMP NOT NULL DEFAULT current_timestamp
    );
  `;
  const res = await client.query(createTableQuery);
  console.log(`Created table.`);
  console.log(klient_data);
  let insertRow = await client.query('INSERT INTO klient(klient_key) VALUES($1);', [`${klient_data}`]);
  console.log(`Inserted ${insertRow.rowCount} row`);
  await client.end();
};

webpush.setVapidDetails(
  'mailto:hasya101@gmail.com',
  process.env.WB_PUB,
  process.env.WB_PRIV
);
app.post('/add', function(req,res) {
    console.log(req);
  handle26(req);
  
});


/*
function handle22(req, res){

    const { subscription, dataToSend } = req.body;
    return webpush
      .sendNotification(subscription, JSON.stringify(dataToSend))
      .then(() => {
        return res.status(200).json({ message: "Notification sent!" });
      })
      .catch((err) => {
        return res.status(400).json({ error: err });
      });
  
}
*/

/*
function handler(req, res) {
  if (req.method === "POST") {
    const { subscription, dataToSend } = req.body;
    return webpush
      .sendNotification(subscription, JSON.stringify(dataToSend))
      .then(() => {
        return res.status(200).json({ message: "Notification sent!" });
      })
      .catch((err) => {
        return res.status(400).json({ error: err });
      });
  }

  return res.status(401).json({ message: "Method not allowed" });
}*/
