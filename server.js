const express = require('express')
const path = require('path')
const logger = require('morgan')
const Product = require('./models/products')
const productSeed = require('./models/productSeed')
const User = require('./models/user')

// load the env vars
require('dotenv').config()

// connect to MongoDB with mongoose
require('./config/database')

// create the Express app
const app = express()


// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ROUTES

// Index
app.get('/products', (req, res) => {
    Product.find({}, (err, allProducts) => {
        res.render('index.ejs', {
            products: allProducts,
        })
    })    
})

app.get('/products/seed', (req, res) => {
    Product.deleteMany({}, (err, allProducts) => {})
    Product.create(productSeed, (err, data) => {
        res.redirect('/products')
    })
})

app.get('/products/new', (req, res) => {
    res.render('new.ejs')
})

app.post('/products', (req, res) => {
    const newProduct = {
        name: req.body.name,
        description: req.body.description,
        img: req.body.img,
        price: Number(req.body.price),
        quantity: Number(req.body.qty),
    }
    console.log(newProduct)
    Product.create(req.body, (err, createProduct) => {
        res.redirect('/products')
    })
})

app.get('/products/:id', (req, res) => {
    Product.findById(req.params.id, (err, foundProduct) => {
        res.render('show.ejs', {
            product: foundProduct,
        })
    })
})


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('listening...')
})