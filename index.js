const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken')
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

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            console.log("back-end index.js", user);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN)
                return res.send({ accessToken: token })
            }
            res.status(403).send('unauthorized User')
        });


        //VERIFICATION=====================================================================Verification
        app.get('/user/:email', async (req, res) => {
            const userEmail = req.params.email;
            const query = { email: userEmail };
            console.log(query);
            const user = await usersCollection.findOne(query);
            console.log(user.userRole);
            res.send(user);
        });


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
            console.log(user);
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
            // const query = { email: mail };
            let query = {}
            if (mail) {
                query = { email: mail }
            }
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


        // PRODUCT ADVERTISEMENT ISSUE
        app.patch('/advertise/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: ObjectId(id) };
            const newStatus = req.body.adStatus;
            const status = { upsert: true };
            const updatedStatus = {
                $set: {
                    adStatus: newStatus,
                }
            }
            const result = await productsCollection.updateOne(filter, updatedStatus, status);
            res.send(result);
        })

        //GET ALL PRODUCTS IN HOMEPAGE TO ADVERTISE
        app.get('/advertised', async (req, res) => {
            // const adStatus = req.query.adStatus;
            // console.log('ad ');
            // console.log(adStatus);
            const query = { adStatus: true, status: true }

            // console.log("all products api", query);
            const productsFor = await productsCollection.find(query).toArray();
            res.send(productsFor);
        })


        //ALL USER DATA BASED ON EMAIL
        app.get('/alluser', async (req, res) => {
            const mail = req.query.email;
            console.log(mail);
            // const query = { email: mail };
            let query = {}
            if (mail) {
                query = { email: mail }
            }
            const oneUser = await usersCollection.find(query).toArray();
            console.log(oneUser);
            res.send(oneUser);

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