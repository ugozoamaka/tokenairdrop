require('dotenv').config({path: '../.env'});
const fs = require('fs');
const parse = require('csv-parse');
const mongoose = require('mongoose');

const init = async () => {
  const recipientSchema = new mongoose.Schema({
    address: String,
    basicAllocation: String,
    bonusAllocation: String,
    totalAllocation: String
  });
  const Recipient = mongoose.models.Recipient || mongoose.model(
    'Recipient', 
    recipientSchema, 
    'recipients'
  );
  await mongoose.connect(
    // process.env.MONGO_URI,
        "mongodb+srv://ugocashflow:understand@cluster0.rqyrd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
  const allocations = [];
  const airdrop = fs
    .createReadStream('./airdrop.csv')
    .pipe(parse({
  }));
  for await (const allocation of airdrop) {
    if(allocation[1] && allocation[1].trim().length === 42) {
      
      allocations.push({
        address: allocation[1].trim().toLowerCase(),
        basicAllocation: allocation[2],
        bonusAllocation: allocation[3],
        totalAllocation: allocation[4],
      });
    }
  }
  await Recipient.insertMany(allocations)
  console.log(`Inserted ${allocations.length} records`);
}

init();
