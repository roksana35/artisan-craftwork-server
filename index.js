const express=require('express');
const cors =require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port=process.env.PORT ||5000;

// middleware
app.use(cors());
app.use(express.json());

// arts-server

// gUaF99H4HkCyNmIG
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qmgfwvr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
     
    const artscraftCollection=client.db('artsaDB').collection('arts');
    const usersCollection=client.db('artsaDB').collection('users');
    const subcategoryCollection=client.db('artsaDB').collection('category');

    app.get('/addcraft',async(req,res)=>{
      const cursor=artscraftCollection.find();
      const result=await cursor.toArray();
      res.send(result)
    })

    // category api
    app.get('/category',async(req,res)=>{
      const cursor=subcategoryCollection.find();
      const result = await cursor.toArray();
      // console.log(result);
      res.send(result)
    })
    app.get('/category/:id',async(req,res)=>{
      // console.log(req.params.id);
      const result=await subcategoryCollection.findOne({_id:new ObjectId(req.params.id)})
      res.send(result);
    })
    app.get('/category/:subcategoryname',async(req,res)=>{
      console.log(req.params.subcategoryname)
      const result=await subcategoryCollection.find({subcategoryname:req.params.subcategoryname}).toArray();
      res.send(result)
    })


    app.get('/myArtlist/:email',async(req,res)=>{
      // console.log(req.params.email);
      const result=await artscraftCollection.find({userEmail:req.params.email}).toArray();
      res.send(result)
    })

    app.get('/update/:id',async(req,res)=>{
      // console.log(req.params.id)
      const result= await artscraftCollection.findOne({_id:new ObjectId(req.params.id)})
      console.log(result)
      res.send(result)
    })
    app.put('/update/:id',async(req,res)=>{
      // console.log(req.params.id);
      const quary={_id: new ObjectId(req.params.id)};
      const data={
        $set:{
          itemname:req.body.itemname,
          subname:req.body.subname,
          cutomization:req.body.cutomization,
          time:req.body.time,
          price:req.body.price,
          rating:req.body.rating,
          stockstatus:req.body.stockstatus,
          image:req.body.image

        }
      }
      const result=await artscraftCollection.updateOne(quary,data);
      console.log(result)
      res.send(result)
    })

    app.post('/addcraft',async(req,res)=>{
      const newCraft=req.body;
      console.log(newCraft);
      const result=await artscraftCollection.insertOne(newCraft);
      res.send(result)
    })

    app.delete('/delete/:id',async(req,res)=>{
      const result= await artscraftCollection.deleteOne({_id:new ObjectId(req.params.id)});
      console.log(result);
      res.send(result)
      
    })

    // user related api
    app.post('/users',async(req,res)=>{
      const user=req.body;
      const result=await usersCollection.insertOne(user);
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('arts and craft server is runing')
})
app.listen(port,()=>{
    console.log(`arts and craft server is runing on port :${port}`)
})