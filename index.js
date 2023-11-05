const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 8080
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9bsrsbd.mongodb.net/?retryWrites=true&w=majority`;

//Middlewares
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Get request is running')
})

app.listen(port, () => {
    console.log('Server is running on port ' + port)
})


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

        const usersCollection = client.db('blogsDB').collection('users')
        const blogsCollection = client.db('blogsDB').collection('blogs')

        app.get('/users', async(req, res) => {
            const cursor = usersCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/blogs', async (req, res) => {
            const cursor = blogsCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/users/:id', async(req, res) => {
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await usersCollection.findOne(query)
            res.send(result)
        })

        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await blogsCollection.findOne(query)
            res.send(result)
        })

        app.get('/blogs/owner/:ownerId', async (req, res) => {
            const ownerId = req.params.ownerId
            const query = { owner: ownerId }
            const result = await blogsCollection.find(query).toArray()
            res.send(result)
        })


        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);
