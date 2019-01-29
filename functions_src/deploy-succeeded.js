// snippet-start:[dynamodb.JavaScript.item.putItem]
// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const contentful = require('contentful');
const webpush = require('web-push');


// Set the region 
AWS.config.update({
    region: 'eu-central-1',
    accessKeyId: process.env.MY_AWS_KEY,
    secretAccessKey: process.env.MY_AWS_SECRET
});


const client = contentful.createClient({
  space: process.env.SPACE_ID,
  accessToken: process.env.ACCESS_TOKEN
})

const webpushOptions = {
    vapidDetails: {
      subject: 'http://feuerwehr-altfraunhofen.de',
      publicKey: process.env.VAPID_KEY_PUBLIC,
      privateKey: process.env.VAPID_KEY_PRIVATE
    }
}

function setUpdateTime(field, date, callback){
    const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    let params ={
        TableName: 'fw_updates',
        Item: {
            'field_id' : {S: field},
            'last_update' : {S: date}
        }
    }
    ddb.putItem(params, function(err, data) {
        if (err) {
          console.log("Error", err);
          callback(err, null)
        } else {
            console.log('set value!!', date)
        }
        });
}

function notifyClients(item, ddb, contentType, callback){
    const payload = {
        topic: contentType,
        title: item.fields.kurzbericht,
        body: `Einsatz in ${item.fields.einsatzort}`,
        data: 'test data',
        url: '/einsaetze/latest',
    }
    if (item.fields.einsatzbild != undefined){
        payload.image = item.fields.einsatzbild.fields.file.url
    }
    var params = {
        ExpressionAttributeValues: {
        ":v1": {
          BOOL: true
         }
       }, 
        FilterExpression: `${contentType} = :v1`, 
        TableName: "fw_subscriptions"
       };
       ddb.scan(params, function(err, data) {
         if (err) console.log(err, err.stack); // an error occurred
         else{
             console.log('Number of subscriptions: ', data.Count)
             const promises = data.Items.map(subscription => {
                 const sub = JSON.parse(subscription.subscription_data.S)
                 return webpush.sendNotification(sub,JSON.stringify(payload), webpushOptions)
             })
             Promise.all(promises).then(values =>{
                const statusCodes = values.map(v => v.statusCode);
               callback(null, {
                statusCode: 200,
                body: JSON.stringify(statusCodes),
                })
            });
         }  
        });
}


exports.handler = function(event, context, callback) {
    const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    let params ={
        TableName: 'fw_updates',
        Key: {
            'field_id' : {S: "einsatz"},
        }
    }
    ddb.getItem(params, function(err, data){
        if (err){
            console.error("Error", err)
            callback(err, err.stack);
        } else{
            client.getEntries({
                content_type: 'einsatz',
                'sys.createdAt[gte]': data.Item.last_update.S
                })
                .then((response) => {
                    //console.log(response)
                    if (response.items.length >= 1){
                        console.log('got one or more items')
                        // for testing an item with image:
                        //const item = response.items.filter(o => o.sys.id === "2OovGtcTDqQYiOewUAm80q")[0]
                        const item = response.items[response.items.length-1]
                        
                        const creationTime = item.sys.createdAt
                        setUpdateTime('einsatz', creationTime, callback)
                        notifyClients(item, ddb, 'einsatz', callback)
                    }
                })
                .catch(e => callback(e, null));
        }
    });

   
    
}