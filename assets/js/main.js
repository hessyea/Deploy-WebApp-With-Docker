const webpush = require('web-push');

// VAPID keys should be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();


webpush.setVapidDetails(
  'mailto:hasya101@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
