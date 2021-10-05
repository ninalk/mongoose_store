const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    shopping_cart: Array
})

module.exports = mongoose.model('User', userSchema)