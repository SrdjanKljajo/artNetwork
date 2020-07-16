const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const mongoose = require('mongoose')
const User = require('../models/user')


module.exports = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: 'Morate biti prijavljeni da bi ste pristupili ovoj stranici' })
    }
    const token = authorization.replace('Bearer ', '')
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: 'Morate biti prijavljeni da bi ste pristupili ovoj stranici' })
        }
        const { _id } = payload
        User.findById(_id)
            .then(userData => {
                req.user = userData
                next()
            })
    })
}