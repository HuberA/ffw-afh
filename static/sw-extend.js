// This is where my new functions will go
var myStupidFunc = function () {
    console.log('Something is happening here; what it is ain\'t at all clear! ')
  }
  
  // Make these global until I can figure more of this out!!
  swReg = null
  isSubscribed = false
  // Copied from https://developers.google.com/web/fundamentals/engage-and-retain/push-notifications/good-notification
  // Here goes nothing, big time!!
  
  console.log("Situation is: " + self.registration ? self.registration.scope : '')
  
  self.addEventListener('message', function(event){
      console.log("SW Received Message: " + event.data);
      //event.ports[0].postMessage("SW Says 'Hello back!'");
  });
  

  self.addEventListener('push', function (event) {
    const payload = event.data ? event.data.json() : 'no payload';
    console.log('got push!!!, payload:')
    console.log(payload)

    const data ={
      body: payload.body,
      icon: 'icons/icon-96x96.png',
      badge: 'icons/icon-96x96.png',
      tag: "request",
      data: payload
    }
   
    if (payload.image)
      data.image = payload.image

    event.waitUntil(
      self.registration.showNotification(payload.title, data));
  })
  
    self.addEventListener('notificationclick', function(event) {
      if (!event.action) {
      // Was a normal notification click
      console.log('Normal Notification Click.');
        console.log('data:', event.notification.data)
        const data = event.notification.data;
        const page = data.url;
        const promiseChain = clients.openWindow(page);
        event.waitUntil(promiseChain);
        } else {
          console.log('Action click on ' + event.action)
        }
  
    console.log('[Service Worker] Notification click Received.');
  
    event.notification.close();
  })
  
  /* We may need this later, so save it for now
  function askPermission() {
    console.log('Notification object is ' + Notification)
    // This is the modern way of doing it; save for future modding
    return new Promise(function(resolve, reject) {
      const permissionResult = Notification.requestPermission(function(result) {
        resolve(result);
      });
      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    })
    .then(function(permissionResult) {
      if (permissionResult !== 'granted') {
        throw new Error('We weren\'t granted permission.');
      }
    })
  }
  */