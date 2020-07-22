const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { JWT_SECRET } = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const { registerValidation, loginValidation } = require('../validation');

router.post('/signup', (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ error: 'Email mora biti u formi email-a, ime i šifra moraju imati najmanje 6 karaktera' })
    const { name, email, password, pic } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: 'Molimo popunite sva polja' })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (savedUser) {
                return res.status(422).json({ error: 'Korisnik sa ovom email adresom već postoji u bazi podataka' })
            }

            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email,
                        password: hashedPassword,
                        name,
                        pic
                    })

                    user.save()
                        .then(user => {
                            res.json({ message: 'Korisnik uspešno sačuvan u bazi podataka' })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/signin', (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ error: 'Email mora biti u formi email-a, šifra mora imati najmanje 6 karaktera' })
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: 'Molimo popunite sva polja' })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: 'Email adresa ili šifra nisu tačni' })
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        //res.json({ message: 'Uspešno ste prijavljeni' })
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        const { _id, name, email, followers, following, pic } = savedUser
                        res.json({ token, user: { _id, name, email, followers, following, pic } })
                    } else {
                        return res.status(422).json({ error: 'Email adresa ili šifra nisu tačni' })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
})


module.exports = router