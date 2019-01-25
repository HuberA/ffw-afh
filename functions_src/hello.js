
// snippet-start:[dynamodb.JavaScript.item.putItem]
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'eu-central-1',
    accessKeyId: process.env.MY_AWS_KEY,
    secretAccessKey: process.env.MY_AWS_SECRET
});


exports.handler = function(event, context, callback) {
    if (event.httpMethod !== "POST"){
        callback("wrong Method")
        return;
    }
    const data = JSON.parse(event.body)
    const subscription = data.subscription;
    const options = data.options;
    console.log('data:', data)

    let params ={
        TableName: 'fw_subscriptions',
        Item: {
            'endpoint_id' : {S: subscription.endpoint},
            'subscription_data' : {S: JSON.stringify(subscription)},
            'bericht' : {BOOL: options.bericht },
            'einsatz' : {BOOL: options.einsatz},
            'termin'  : {BOOL: options.termin}
        }
    }

    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    // Call DynamoDB to add the item to the table
    ddb.putItem(params, function(err, data) {
    if (err) {
      console.log("Error", err);
      callback(err, null)
    } else {
      
      data = {
          data:{
              success: true,
              bericht: options.bericht,
              termin: options.termin,
              einsatz: options.einsatz
          }
      }
      console.log("Success", data);
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(data),
        });
    }
  });
    
}