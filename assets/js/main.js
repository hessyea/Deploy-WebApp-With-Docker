const webpush = require('web-push');
var http = require('http');
const fs = require('fs');
const java = fs.readFileSync('./worker.js');
// VAPID keys should be generated only once.
http.createServer(function (req, res) {
  
  res.setHeader("Content-Type", "text/javascript");
  res.write(java);
  if(req.url.pathname === "/stat"){
    
    handler(req, res);
  }
  
}).listen(8080);



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
}
