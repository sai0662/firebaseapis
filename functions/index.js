const functions = require("firebase-functions");
const admin = require('firebase-admin');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
//admin.firestore().settings({timestampsInSnapshots: true});
exports.helloWorld = functions.https.onRequest((request, response) => {
  //functions.logger.info("Hello logs!", {structuredData: true});
  var myData = [];
  admin.firestore().collection('newposts').get()
  .then(snapshot => {
    console.log('snapshot', snapshot.size)
    snapshot.docs.map(eachDoc => {
        myData.push({id: eachDoc.id, ...eachDoc.data()})
    })
    response.send({status: true, data: dataArray});
  }).catch(e =>{
    response.send({status: false, data: null})
  })
});

//To send push notification to specific group
exports.sendPushtoTopic = functions.https.onRequest((request, response) => {
  var topic = request.body.topic
  var title = request.body.title
  var description = request.body.description
  if(typeof topic !== 'undefined')
  {
    const message = {
      notification:{
          title: title,
          body: description
      },  
      topic: topic
    };
    return admin.messaging().send(message)
    .then((response2) => {
      console.log('Successfully send message', response2);
      return response.send({status: true})
    })
    .catch((error) => {
      console.log('Error sending message', error)
      return response.send({status: false})
    })
  }
})


exports.AddNews = functions.https.onRequest((request, response) => {
admin.firestore().collection('newposts').add({title: request.body.title, body: request.body.description})
.then(response3 => {
  response3.send({status: true})
}).catch(error => {
  response.send({status: false})
})
});