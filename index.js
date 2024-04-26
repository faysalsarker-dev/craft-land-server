const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000;

// Using cors middleware
app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.local.DB_USER}:${process.env.local.DB_PASSWORD}@cluster0.3liiwir.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const coffeeCollection = client.db('coffeeDB').collection('coffee');
    const simple_mflix = client.db('sample_mflix').collection('users');

    app.get('/users', async (req, res) => {
      const cursor = simple_mflix.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await simple_mflix.deleteOne(query);
      res.send(result);
    });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Any cleanup or finalization can be done here
  }
}

run().catch(console.error);

app.get('/', (req, res) => {
  res.send(`Simple CRUD is running`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
