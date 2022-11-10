const MongoDB = require("./src/services/MongoDB")
const jwt = require('jsonwebtoken')
const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors({origin: "*"}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const mongodb = new MongoDB()
const database = "restaurant_reviews"
app.get('/', (req, res) => {
    res.status(200).send('Hello')
}) 

// Gettinng all reviews
app.get('/review', async (req, res) => {
    console.log('respond')
    // Create
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
/**
 * Endpoint for Logging in user
 */
app.post('/user/login', async (req, res) => {{
    const { email, password } = req.body
    console.log(email, password)
    const model = "users"
    const fetch = await (await mongodb.collection(database, model)).findOne({
        email: email,
        password: password
    })
    // if there is no user found
    if (!fetch) {
        return res.status(404).send({
            name: 'CREDENTIALS_NOT_FOUND'
        })
    }

    const accessToken = jwt.sign({
        id: fetch._id
    }, `${process.env.TOKEN_SECRET}`,{
        expiresIn: '1d'
    })
    return res.status(200).send({
        fetch,
        accessToken: accessToken
    })

}})

app.post('/user/register', async (req, res) => {

})
app.listen(5000, () => {
    console.log('App Started ' + 5000)
})