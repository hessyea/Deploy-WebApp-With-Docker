const webpush = require('web-push');

// VAPID keys should be generated only once.
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
export default function handler(req, res) {
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
