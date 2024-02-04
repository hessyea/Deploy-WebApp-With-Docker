
function registerServiceWorker() {
  return navigator.serviceWorker
    .register("/main.js")
    .then(function (registration) {
      console.log("Service worker successfully registered.");
      return registration;
    })
    .catch(function (err) {
      console.error("Unable to register service worker.", err);
    });
}
function requestPermission() {
  return new Promise((resolve, reject) => {
    const permissionResult = Notification.requestPermission((result) => {
      resolve(result);
    });
    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then((permissionResult) => {
    if (permissionResult !== "granted") {
      throw new Error("Permission denied");
    }

    subscribeUserToPush();
  });
}
async function subscribeUserToPush() {
  const registration = await registerServiceWorker();

  const subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: PUBLIC_VAPID_KEY,
  };

  const pushSubscription = await registration.pushManager.subscribe(
    subscribeOptions
  );

  axios
    .post("/api/subscription", pushSubscription)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => console.log(error));
  return pushSubscription;
}
self.addEventListener("push", function (event) {
  const data = event.data.json();
  const promiseChain = self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/01_green.png",
    badge: "/01_green.png",
  });
  event.waitUntil(promiseChain);
});
