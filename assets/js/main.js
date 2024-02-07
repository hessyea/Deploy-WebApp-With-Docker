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

/*
app.get('/tst', function(req, res){
 handle22(req, res);
});*/


if (process.env.RUN_TIMES == 0){
  var vapidKeys = webpush.generateVAPIDKeys();
  process.env.PUB_KEY = vapidKeys.publicKey;
  process.env.PRIV_KEY = vapidKeys.privateKey;
  process.env.RUN_TIMES = 1;
  console.log("done VAPI_KEYS");
}
console.log("done already VAPI_KEYS: ",process.env.PUB_KEY);
webpush.setVapidDetails(
  'mailto:hasya101@gmail.com',
  process.env.PUB_KEY,
  process.env.PRIV_KEY
);

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
  const res22 = await client.query('SELECT $1::text as connected', ['Connection to postgres successful!']);
  console.log(res.rows[0].connected);
  await client.end();
})();

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
