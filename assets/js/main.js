const webpush = require('web-push');

// VAPID keys should be generated only once.
if (process.env.RUN_TIMES == 0){
  var vapidKeys = webpush.generateVAPIDKeys();
  process.env.PUB_KEY = vapidKeys.publicKey;
  process.env.PRIV_KEY = vapidKeys.privateKey;
  process.env.RUN_TIMES = 1;
  
}

webpush.setVapidDetails(
  'mailto:hasya101@gmail.com',
  process.env.PUB_KEY,
  process.env.PRIV_KEY
);
