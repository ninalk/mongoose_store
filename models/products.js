const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {type: String, require: true},
    description: String,
    img: String,
    price: {type: Number, min: 0},
    qty: {type: Number, min: 0},
}, {
    timestamps: true
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product