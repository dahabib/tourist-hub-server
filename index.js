const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7ihro.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send("it's working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const servicesCollection = client.db("tourist-hub").collection("services");
    const bookingsCollection = client.db("tourist-hub").collection("bookings");
    const reviewsCollection = client.db("tourist-hub").collection("reviews");
    const placesCollection = client.db("tourist-hub").collection("places");
    const guidesCollection = client.db("tourist-hub").collection("guides");
    const userCollection = client.db("tourist-hub").collection("user");

    app.post('/bookService', (req, res) => {
        const booking = req.body;
        bookingsCollection.insertOne(booking)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.get('/allBooking', (req, res) => {
        bookingsCollection.find({})
            .toArray((err, bookings) => {
                res.send(bookings);
            })
    })

    app.post('/bookingsByUser', (req, res) => {
        const email = req.body.email;
        userCollection.find({ email: email })
            .toArray((err, users) => {

            })
    })

    app.post('/addUser', (req, res) => {
        const user = req.body;
        userCollection.insertOne({ user })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/addService', (req, res) => {
        const service = req.body;
        servicesCollection.insertOne({ service })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/addGuide', (req, res) => {
        const guide = req.body;
        guidesCollection.insertOne({ guide })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/addPlace', (req, res) => {
        const place = req.body;
        placesCollection.insertOne({ place })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/addReview', (req, res) => {
        const review = req.body;
        reviewsCollection.insertOne(review)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/services', (req, res) => {
        servicesCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.get('/guides', (req, res) => {
        guidesCollection.find({})
            .toArray((err, guides) => {
                res.send(guides);
            })
    });

    // user by email
    app.get('/user', (req, res) => {
        userCollection.find({ "user.email": req.query.email })
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    // all users
    app.get('/users', (req, res) => {
        userCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

});

app.listen(port);
console.log('listening on port', port);