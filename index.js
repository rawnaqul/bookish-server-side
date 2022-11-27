const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const bookingCollection = client.db('bookish').collection('booking');

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

        //REMOVE PRODUCT
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        })


        //BOOKING INFO
        app.post('/bookinginfo', async (req, res) => {
            const booking = req.body;
            const newBooking = await bookingCollection.insertOne(booking);
            res.send(newBooking);
        });


        //GET PRODUCTS BY USER
        app.get('/products', async (req, res) => {
            const mail = req.query.email;
            const query = { email: mail };
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        })

        // PRODUCT STATUS CHANGE
        app.patch('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const newStatus = req.body.status;
            const status = { upsert: true };
            const updatedStatus = {
                $set: {
                    status: newStatus,
                }
            }
            const result = await productsCollection.updateOne(filter, updatedStatus, status);
            res.send(result);
        })


    }
    finally { }
}


//CALLING FUNCTION
run().catch(err => console.error(err));


//SERVER-RUN
app.get('/', async (req, res) => {
    res.send('Bookish server side is jore-shore running')
})
app.listen(port, () => console.log(`Bookish server side isss running on port ${port}`))