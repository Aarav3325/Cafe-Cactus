// js/model/order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        zipCode: String
    },
    items: [{
        id: String,
        name: String,
        price: Number,
        quantity: Number
    }],
    instructions: String,
    paymentMethod: String,
    subtotal: Number,
    deliveryFee: Number,
    tax: Number,
    total: Number,
    status: String,
    username: String,
    orderId: String,
    orderDate: String
});

module.exports = mongoose.model('Order', orderSchema);
