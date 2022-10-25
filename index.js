const MongoDB = require("./src/services/MongoDB")
const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors({origin: "*"}))
app.use(express.json())


app.get('/', (req, res) => {
    res.status(200).send('Hello')
}) 

// Gettinng all reviews
app.get('/review', async (req, res) => {
    console.log('respond')
    // Create
    const mongodb = new MongoDB()
    const database = "restaurant_reviews"
    const model = "reviews"
    const fetch = await (await mongodb.collection(database, model)).find({})
    const snapshots = await fetch.toArray()
    return await res.status(200).send(snapshots)
})

// Creating a review
app.post('/review', async (req, res) => {
    console.log("Load")
    const { title, restaurant, date, cuisine, review, foodordered, ratings, imageUrl} = req.body
    const mongodb = new MongoDB()
    const database = "restaurant_reviews"
    const model = "reviews"
    // Data
    const data = {
        title,
        restaurant,
        date,
        cuisine,
        review,
        foodordered,
        ratings,
        imageUrl
    }
    // Create
    const create = await (await mongodb.collection(database, model)).insertOne(data)
    return res.status(200).send('OK')
})

app.post('/auth', (req, res) => {{
    
}})
app.listen(5000, () => {
    console.log('App Started ' + 5000)
})