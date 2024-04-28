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

    const craftCollection = client.db('craft').collection('craftitem');
    // const simple_mflix = client.db('sample_mflix').collection('users');

    console.log('data base connected');
    app.get('/allCraft', async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/productDetails/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await craftCollection.findOne(query);
      res.send(result);
    });


    app.put('/update/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const info = req.body;
      const data = {
        $set: {

          name: info.name,
          img: info.img,
          price: info.price,
          rating: info.rating,
          processing_Time: info.processing_Time,
          price: info.price,
          sub_category: info.sub_category,
          customization: info.customization,
          stockStatus: info.stockStatus,
          description: info.description



        }
      }
      const result = await craftCollection.updateOne(query, data, options)
      res.send(result)
    })

    app.get('/myCraft/:email', async (req, res) => {
      const email = req.params.email
      const cursor = craftCollection.find({ email: email })
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/myCraft/:email/:filter', async (req, res) => {
      const filter = req.params.filter
      const email = req.params.email
      const cursor = craftCollection.find({ customization: filter, email: email })
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/category/:category', async (req, res) => {
      const category = req.params.category
      console.log(category);
      const cursor = craftCollection.find({ sub_category: category })
      const result = await cursor.toArray();
      res.send(result)
    })

    app.post('/addcraft', async (req, res) => {
      const newCraft = req.body;
      console.log(newCraft);
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    });



    app.delete('/deleteitam/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
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
