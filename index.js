const express = require('express')
const app = express()
const cors = require('cors')

require('dotenv').config()
//port
const port = process.env.PORT || 5000
// middleware
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yziu76d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const userCollection = client.db("messTracker").collection("users")
        const userMealCollection = client.db("messTracker").collection("meals")
        const userDepositCollection = client.db("messTracker").collection("deposit")
        const bazarCollection = client.db("messTracker").collection("bazar")
        const cookBilCollection = client.db("messTracker").collection("cookBill")
        // cook bil post
        app.post('/cookBill', async (req, res) => {
            const cook = req.body;
            const result = await cookBilCollection.insertOne(cook);
            res.send(result)
        })
        app.get('/cookBill', async (req, res) => {
            const cursor = cookBilCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exists', insertedId: null })
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
        });
        app.get('/users', async (req, res) => {

            const cursor = userCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })
        // find individual user by email
        app.get('/usersFind', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const cursor = userCollection.find(query);
            const result = await cursor.toArray()
            res.send(result);
        })
        // user meal find
        app.get('/usersMealFind', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const cursor = userMealCollection.find(query);
            const result = await cursor.toArray()
            res.send(result);
        })
        // add meal
        app.post('/addMeals', async (req, res) => {
            const meals = req.body;
            const result = await userMealCollection.insertOne(meals);
            res.send(result)
        })
        // find all members meal
        app.get('/membersAllMeals', async (req, res) => {
            const cursor = userMealCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })
        // add deposit
        app.post('/deposit', async (req, res) => {
            const money = req.body;
            const result = await userDepositCollection.insertOne(money);
            res.send(result)
        })
        // get all deposit find API
        app.get('/deposit', async (req, res) => {
            const cursor = userDepositCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/usersDeposit', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const cursor = userDepositCollection.find(query);
            const result = await cursor.toArray()
            res.send(result);
        })
        //Bazar 
        app.post('/bazar', async (req, res) => {
            const bazar = req.body;
            const result = await bazarCollection.insertOne(bazar);
            res.send(result)
        })
        //Find all bazar
        app.get('/bazar', async (req, res) => {
            const cursor = bazarCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello I am from server')

})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})