const express = require('express');
const {mongoose} = require('mongoose');
const jwt = require('jsonwebtoken');
const {isEmail} = require('validator');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate: [isEmail, 'Please enter a valid email'],
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
});

const collection = new mongoose.model('user', userSchema);
module.exports = collection;