const xhr = new XMLHttpRequest();
function registerServiceWorker() {
  return navigator.serviceWorker
    .register("/worker.js")
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
    applicationServerKey: "BBArYxq7r_6XHxoDDkYH5j8lmZno466kkO3hlrwdT-hsF3Ax4diDg2q53rvkUpclKNejQS409WH9h2lI-LPw7X0",
  };

  const pushSubscription = await registration.pushManager.subscribe(
    subscribeOptions
  );
console.log(pushSubscription);
  xhr.open("POST", "/add", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
   xhr.send(JSON.stringify(pushSubscription));
  return "null";
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
