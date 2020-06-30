const config = require('../config');
const MongoClient = require('mongodb').MongoClient;
const readline = require('readline');
const validator = require('email-validator');

const insertUser = async email => {
  const client = await MongoClient.connect(config.mongodb.url, { useUnifiedTopology: true });
  const db = client.db();
  await db.collection('users').insertOne({ email });
  client.close();
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter user email: ', async email => {
  try {
    if (!validator.validate(email)) {
      throw new Error('invalid email specified');
    }

    await insertUser(email);
    console.log('User created successfully!');
  } catch (e) {
    console.error(`User document inserted unsuccessfully...`);
    console.error(e.message);
  }

  rl.close();
});