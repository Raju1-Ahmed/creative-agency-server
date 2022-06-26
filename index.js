const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000



app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ikxgc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        //Data Base File Collection
        const serviceCollection = client.db('creative-agency').collection('services');
        const workCollection = client.db('creative-agency').collection('works');
        const feedbackCollection = client.db('creative-agency').collection('feedback');
        const userCollection = client.db('creative-agency').collection('users');


        //Get  service data
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        //Get  work Data
        app.get('/works', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        //Get  feedback Data
        app.get('/feedback', async (req, res) => {
            const query = {};
            const cursor = feedbackCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        //single user admin collection api
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };

            const result = await userCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({result, token});
        })
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Creative Agency!')
})

app.listen(port, () => {
    console.log(`Creative Agency Listener on Port: ${port}`)
})