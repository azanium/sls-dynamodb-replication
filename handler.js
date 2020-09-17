'use strict';

const AWS = require('aws-sdk');
const client = new AWS.DynamoDB.DocumentClient({ region: 'ap-southeast-1' });

/*
"pk": {"S":"1"},
                    "sk": {"S":"cat1_081214006625"},
                    "cn": {"S":"081214006625"},
                    "cid": {"S":"cat1"},
                    "oid": {"S":"op12"},
                    "lbl": {"S":"Ahmad Simpati"}*/

/*
   "digital":{
      "category_1":{
         "operator_12":{
            "uuid_1_12_08111611889":{
               "client_number":"08111611889",
               "is_bill":"false",
               "last_order_date":"20181001112730",
               "last_product":"118",
               "last_updated":"20181001112730"
            }
         }
      }*/

const handleInsert = async record => {
  const { NewImage } = record.dynamodb;
  const uid = NewImage.uid.S;
  const userData = NewImage.user_data.S;
  const { digital } = JSON.parse(userData);
  const category = Object.keys(digital)[0];

  console.log(`=> New Image's UID: ${uid}, category: ${category},  userData: ${userData}`);
  // const params = {
  //   Item: {
  //     pk: uid,
  //   }
  // }
  return NewImage;
};

const handleRemove = async record => {
  const { OldImage } = record.dynamodb;
  const uid = OldImage.uid.S;
  const userData = OldImage.user_data.S;

  console.log(`=> Old Image's UID: ${uid}, userData: ${userData}`);
  return OldImage;
}

module.exports.hello = async event => {
  console.log("# Records: ", event.Records);
  const { Records } = event;
  Records.forEach(record => {
    console.log('# record', record)
    switch (record.eventName) {
      case "INSERT":
        handleInsert(record);
        break;

      case "REMOVE":
        handleRemove(record);
        break;
    }
  });

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
