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

        app.get('/categories', async (req, res) => {
            const query = {};
            const cursor = categoryCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories)
        })

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