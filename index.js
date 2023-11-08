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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const bookCollection = client.db("bookDB").collection("books");
    const userCollection = client.db("userDB").collection("user");
    const borrowedCollection = client.db("borrowedDB").collection("borrowedItems");

    // //get all users
    // app.get('/user', async(req, res)=>{
    //   const cursor = userCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result);

    // })
    
    //get specific users for ------------------>ADMIN
    app.get('/user', async(req, res)=>{
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      console.log(query);
      const result = await userCollection.find(query).toArray();
      res.send(result);
    })

    // set user
    app.post('/user', async(req, res)=>{
      const newUser = req.body;
      console.log(newUser);
      const result = await userCollection.insertOne(newUser)
      res.send(result);
      // console.log(object);
    })

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
   
     //find a product
    app.delete('/books/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await bookCollection.findOne(query)
      res.send(result)
     })

    // update quantity decrement
    app.patch('/books/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)};
      const options = {upsert: true};
      const updateQuantity = req.body;
      console.log(updateQuantity);
      const updatedDoc = {
        $set: {
          quantity: updateQuantity?.quantity>0 ? updateQuantity.quantity - 1 : updateQuantity.quantity
        }, 
      }
      const result = await bookCollection.updateOne(filter, updatedDoc, options)
      res.send(result);
    }) 

    //update product
    app.put('/books/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = {upsert: true};
      const updatedBook = req.body;
      const bookUpdated = {
        $set: {
          photo: updatedBook.photo,
          pdf: updatedBook.pdf,
          name: updatedBook.name,
          authorname: updatedBook.authorname,
          price: updatedBook.price,
          quantity: updatedBook.quantity,
          description: updatedBook.description,
          rating: updatedBook.rating,
          category: updatedBook.category,
        }
      };
    
      try {
        const result = await bookCollection.updateOne(filter, bookUpdated, options);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send('Error updating book!');
      }
    });
    
    // set borrowed data
    app.post("/borrowed", async(req, res)=>{
      const borrowed = req.body;
      console.log(borrowed);
      const result = await borrowedCollection.insertOne(borrowed);
      res.send(result);
    })
    
    //get some products based on email on cart
    app.get('/borrowed', async(req, res)=>{
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await borrowedCollection.find(query).toArray();
      res.send(result);
    })
   
    // delete some data from cart
    app.delete('/borrowed/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await borrowedCollection.deleteOne(query);
        res.send(result);
    })

    // update booking status
    app.patch('/borrowed/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const updatedBooking = req.body;
      console.log(updatedBooking);
      const updatedDoc = {
        $set: {
          status: updatedBooking.status,
        },
      }
      const result = await borrowedCollection.updateOne(filter, updatedDoc)
      res.send(result);
    })








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
