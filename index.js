const express = require('express');
const cors = require('cors');
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000;

// Using cors middleware
app.use(express.json());
app.use(cors());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3liiwir.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const craftCollection = client.db('craft').collection('craftitem');
    // const simple_mflix = client.db('sample_mflix').collection('users');


    app.get('/allCraft', async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/productDetails/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result =await craftCollection.findOne(query);
      res.send(result);
    });
    

    app.get('/myCraft:email',async(req,res)=>{
      const email = req.params.email
      const cursor = craftCollection.find({email: email})
      const result = await cursor.toArray();
      res.send(result)
    })

    app.post('/addcraft', async (req, res) => {
      const newCraft = req.body;
      console.log(newCraft);
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    });




    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Any cleanup or finalization can be done here
  }
}

run().catch(console.error);

app.get('/', (req, res) => {
  res.send(`Simple CRUD is running Craftland`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
