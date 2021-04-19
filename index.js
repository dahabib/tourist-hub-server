const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const fileUpload = require('express-fileupload');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7ihro.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('services'));
app.use(express.static('guides'));
app.use(fileUpload());

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
                console.log(users);
                if (user.role === 'user') {
                    bookingsCollection.find({ email: email })
                        .toArray((err, documents) => {
                            res.send(documents);
                        })
                }
            })
    })

    app.post('/addService', (req, res) => {
        const name = req.body.name;
        const description = req.body.description;
        const location = req.body.location;
        const cost = req.body.cost;
        const file = req.files.file;
        const createdBy = req.body.createdBy;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        servicesCollection.insertOne({ name, description, location, cost, createdBy, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/addGuide', (req, res) => {
        const name = req.body.name;
        const email = req.body.email;
        const file = req.files.file;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        servicesCollection.insertOne({ name, email, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/addPlace', (req, res) => {
        const name = req.body.name;
        const description = req.body.description;
        const file = req.files.file;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        placesCollection.insertOne({ name, description, image })
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

    app.get('/guides', (req, res) => {
        guidesCollection.find({})
            .toArray((err, guides) => {
                res.send(guides);
            })
    });

    // app.post('/isAdmin', (req, res) => {
    //     const email = req.body.email;
    //     userCollection.find({ role: role })
    //         .toArray((err, admins) => {
    //             res.send(admins.length > 0);
    //         })
    //         userCollection.find({ email: email })
    //         .toArray((err, users) => {
    //             const filter = { role: role }
    //             if (users.length === 0) {
    //                 filter.email = email;
    //             }
    //             userCollection.find(filter)
    //                 .toArray((err, documents) => {
    //                     console.log(email, date.date, doctors, documents)
    //                     res.send(documents);
    //                 })
    //         })
    // })

});

app.listen(port);
console.log('listening on port', port);