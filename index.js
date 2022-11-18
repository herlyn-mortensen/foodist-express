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


//Delete a review

app.post('/delete/reviews/:reviewId', async function (req, res) {
    console.log("deleted")
    await db.collection('reviews').deleteOne({
        '_id': ObjectID(req.params.reviewId)
    })
    res.redirect('/')
})


//Add comment

app.post('/reviews/:reviewId/comments', async function(req,res){
    const results = await db.collection('reviews').updateOne({
        _id: ObjectID(req.params.reviewId)
    },{
        '$push':{
            'comments':{
                '_id': ObjectID(),
                'review': req.body.review,
                'nickname': req.body.nickname
            }
        }
    })

    res.json({
        'message': 'Comment has been added successfully',
        'results': results
    })
})


//Edit commment

app.put('/comments/:commentId/update', async function(req,res){
    const results = await db.collection('reviews').updateOne({
        'comments._id':ObjectID(req.params.commentId)
    },{
        '$set': {
            'comments.$.review': req.body.review,
            'comments.$.nickname': req.body.nickname
        }
    })
    res.json({
        'message': 'Comment updated',
        'results': results
    })
})
app.delete('/comments/:commentId', async function(req,res){
    const results = await db.collection('reviews').updateOne({
        'comments._id': ObjectID(req.params.commentId)
    }, {
        '$pull': {
            'comments': {
                '_id': ObjectID(req.params.commentId)
            }
        }
    })
    res.json({
        'message': 'Comment deleted',
        'result': results
    })
})





/**
 * Endpoint for Logging in user
 */
app.post('/user/login', async (req, res) => {{
    const { email, password } = req.body
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
        ...fetch,
        accessToken: accessToken
    })

}})

app.post('/user/register', async (req, res) => {
    const { email, password } = req.body
    const model = "users"
    const fetch = await (await mongodb.collection(database, model)).findOne({
        email: email,
    })
    // if there is no user found
    if (fetch) {
        return res.status(404).send({
            name: 'USER_ALREADY_EXISTS'
        })
    }

    const create = await (await mongodb.collection(database, model)).insertOne({
        email: email,
        password
    })
   
    const accessToken = jwt.sign({
        id: create._id
    }, `${process.env.TOKEN_SECRET}`,{
        expiresIn: '1d'
    })
    return res.status(200).send({
        ...create,
        accessToken: accessToken
    })
})

//const delete = await (await mongodb.collection(database, model)).deleteOne({
//    email: email,
//    password
//})

app.listen(5000, () => {
    console.log('App Started ' + 5000)
})