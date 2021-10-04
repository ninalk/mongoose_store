const express = require('express')
const path = require('path')
const logger = require('morgan')
const methodOverride = require('method-override')
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
app.use(methodOverride('_method'))
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
            index: req.params.id,
        })
    })
})



// Update route
// updates buy button


app.get('/products/:id/edit', (req, res) => {
    Product.findById(req.params.id, (err, editProduct) => {
        res.render('edit.ejs', {
            product: editProduct,
            index: req.params.id,
        })
    })

})

// updates product
app.put('/products/:id/edit', (req, res) => {
    Product.findById(req.params.id, (err, product) => {
        product.name = req.body.name
        product.description = req.body.description
        product.img = req.body.img
        product.price = Number(req.body.price)
        product.qty = Number(req.body.qty)


        product.save(err => {
            if (err) return res.render(`products/${req.params.id}/edit`, {
                product, index: req.params.id
            })

            res.redirect(`/products/${product._id}`)
        })
    })
})

app.put('/products/:id', (req, res) => {
    Product.findById(req.params.id, (err, product) => {
        product.qty -= 1
        console.log(product.qty)
        product.save(err => {
            res.redirect(`/products/${product._id}`)
        })
    })

})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('listening...')
})