const webpush = require('web-push');
var http = require('http');
const express = require('express');
const app = express();
require('dotenv').config();
const { Client } = require('pg');
// VAPID keys should be generated only once.
app.use(express.static('fold22'));
app.listen(8080, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port");
});
if (process.env.RUN_TIMES == 0){
  var vapidKeys = webpush.generateVAPIDKeys();
  process.env.PUB_KEY = vapidKeys.publicKey;
  process.env.PRIV_KEY = vapidKeys.privateKey;
  global.RUN_TIMES = 1;
  console.log("done VAPI_KEYS");
}
/*
app.get('/tst', function(req, res){
 handle22(req, res);
});*/
(async () => {
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
    CREATE TABLE IF NOT EXISTS keyss(
      id BIGSERIAL PRIMARY KEY NOT NULL ,
      pub_name varchar,
      priv_name varchar,
      date TIMESTAMP NOT NULL DEFAULT current_timestamp
    );
  `;
  const res = await client.query(createTableQuery);
  console.log(`Created table.`);
  let insertRow = await client.query('INSERT INTO keyss(pub_name,priv_name) VALUES($1,$2);', [`${process.env.PUB_KEY, process.env.PRIV_KEY}`]);
  console.log(`Inserted ${insertRow.rowCount} row`);
  await client.end();
})();


console.log("done already VAPI_KEYS: ",process.env.PUB_KEY);
webpush.setVapidDetails(
  'mailto:hasya101@gmail.com',
  process.env.PUB_KEY,
  process.env.PRIV_KEY
);



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
