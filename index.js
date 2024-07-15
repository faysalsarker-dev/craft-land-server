const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000;

// Using cors middleware
app.use(cors(
  {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174'

    ],
    credentials: true
  }
));
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3liiwir.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const veryfyToken = (req, res, next) => {
  const token = req?.cookies?.token;
  if(!token){
    return req.status(401).send({Message : 'kj hobe na bro '})
  }
  jwt.verify(token,process.env.SECRET_SERVER,(err,decoded)=>{
    if(err){
      return res.status(401).send({message:'ae ber o kj hobe na'})
    }
    req.user = decoded;
    next()
  })

}

async function run() {
  try {

    const craftCollection = client.db('craft').collection('craftitem');


    app.post('/jwt', (req, res) => {
      const user = req.body;
      console.log(user);
      const token = jwt.sign(user, process.env.SECRET_SERVER, { expiresIn: '1h' })
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      }).send({ success: true })
    })

    app.post('/logout',(req,res)=>{
      const user = req.user;
      res.clearCookie('token',{
        maxAge:
        0
      }).send({success:true})
    })

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

    app.get('/myCraft/:email',veryfyToken, async (req, res) => {
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
