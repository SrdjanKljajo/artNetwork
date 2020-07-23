const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = require('../models/post')
const requireLogin = require('../middleware/requireLogin')

router.get('/allposts', requireLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .sort('-createdAt')
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/getsubpost', requireLogin, (req, res) => {

    // if postedBy in following
    Post.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .sort('-createdAt')
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/myposts', requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .sort('-createdAt')
        .then(myposts => {
            res.json({ myposts })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/createpost', requireLogin, (req, res) => {
    const { body, pic, date } = req.body
    if (!body || !pic) {
        res.status(422).json({ error: "Molimo popunite sva polja" })
    }
    req.user.password = undefined
    const post = new Post({
        body,
        photo: pic,
        postedBy: req.user,
        date
    })
    post.save()
        .then(result => {
            res.json({ result })
        })
        .catch(err => {
            console.log(err)
        })
})

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    })
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
})

router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    })
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
})

router.put('/comment', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    })
        .populate("comments.postedBy", "_id name pic")
        .populate("postedBy", "_id name pic")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
})

router.delete('/deletepost/:postId', requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ error: err })
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then(result => {
                        res.json(result)
                    }).catch(err => {
                        console.log(err)
                    })
            }
        })
})
/*
router.delete("/deletecomment/:commentId", requireLogin, (req, res) => {
    Post.findByIdAndDelete(req.params.commentId)
        .populate("comments.postedBy", "_id name pic")
        .populate("postedBy", "_id name pic")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result);
            }
        })
}) */


module.exports = router