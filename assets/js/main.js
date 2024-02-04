const webpush = require('web-push');
var http = require('http');
// VAPID keys should be generated only once.
http.createServer(function (req, res) {
  req.navigator.serviceWorker
    .register("worker.js")
    .then(function (registration) {
      console.log("Service worker successfully registered.");
      res.write(registration);
    })
    .catch(function (err) {
      console.error("Unable to register service worker.", err);
    });
}).listen(8080);
if (process.env.RUN_TIMES == 0){
  var vapidKeys = webpush.generateVAPIDKeys();
  process.env.PUB_KEY = vapidKeys.publicKey;
  process.env.PRIV_KEY = vapidKeys.privateKey;
  process.env.RUN_TIMES = 1;
  console.log("done VAPI_KEYS");
}

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
module.exports = handler;
