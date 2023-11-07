const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json());


//hv2ReAvSCVR00jYS
//BookShelf

const uri = "mongodb+srv://BookShelf:hv2ReAvSCVR00jYS@cluster0.wlvfdkk.mongodb.net/?retryWrites=true&w=majority";

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const bookCollection = client.db("bookDB").collection("books");
    const userCollection = client.db("userDB").collection("user");
    const cartCollection = client.db("cartDB").collection("cartItems");

    //get all products
    app.get('/books', async(req, res)=>{
      const cursor = bookCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    //get a product
    app.get('/books/:id', async(req, res)=>{
      const id = req.params.id;
      console.log(id);
      const query = {_id: new ObjectId(id)};
      console.log(query);
      const result = await bookCollection.findOne(query)
      console.log(result);
      res.send(result);
    })


    // set product
    app.post('/books', async(req, res)=>{
      const newBook = req.body;
      console.log(newBook);
      const result = await bookCollection.insertOne(newBook)
      res.send(result);
    })


    //delete a product
    app.delete('/books/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await bookCollection.deleteOne(query)
      res.send(result)
     })


    //update product
    app.put('/books/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedBook = req.body;
      const bookUpdated = {
        $set: {
          name: updatedBook.name,
          photo: updatedBook.photo,
          category: updatedBook.category,
          price: updatedBook.price,
          description: updatedBook.description,
          rating: updatedBook.rating,
        }
      };
    
      try {
        const result = await productCollection.updateOne(filter, productUpdated);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send('Error updating product');
      }
    });
    



  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req, res)=> {
    res.send('Library Server is Open now!')
})
app.listen(port, ()=>{
    console.log(`Library is open at : ${port}`);
})
