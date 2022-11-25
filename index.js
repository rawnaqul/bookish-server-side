const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();



//MIDDLEWARE

app.use(cors())
app.use(express.json())

//MONGODB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clusterophob.vxcewqd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//DATA

async function run() {
    try {
        const categoryCollection = client.db('bookish').collection('categories');
        const productsCollection = client.db('bookish').collection('products');
        const usersCollection = client.db('bookish').collection('users');

        //CATEGORY DATA LOAD
        app.get('/categories', async (req, res) => {
            const query = {};
            const cursor = categoryCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories)
        })

        //DATA LOAD UNDER CATEGORY ID
        app.get('/products/:name', async (req, res) => {
            const categoryName = req.params.name;
            const query = { category: categoryName };
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        })

        //ADD USER
        app.post('/users', async (req, res) => {
            const user = req.body;
            const users = await usersCollection.insertOne(user);
            res.send(users);
        });

        //ADD PRODUCT
        app.post('/products', async (req, res) => {
            const product = req.body;
            const newProducts = await productsCollection.insertOne(product);
            res.send(newProducts);
        });


    }
    finally { }
}


//CALLING FUNCTION
run().catch(err => console.error(err));


//SERVER-RUN
app.get('/', async (req, res) => {
    res.send('Bookish server side is running')
})
app.listen(port, () => console.log(`Bookish server side isss running on port ${port}`))