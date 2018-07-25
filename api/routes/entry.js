const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Entry = require('../models/entry')
const User = require('../models/users')
const checkAuth = require('../middleware/auth')
const checkAuth2 = require('../middleware/auth2')
const entryService = require('../services/entryService');

//  lista svih unosa istog usera
router.get('/users/:userId/entries', checkAuth, checkAuth2, function (req, res, next) {
    const id = req.params.userId
    entryService.getEntriesByUserId(id).then(function (response) {
        return res.json(200, response)
    }).catch(error => res.json(400, error));
})

router.post('/', checkAuth, checkAuth2, function (req, res, next) {
    User.findById(req.body.userId).exec().then(doc => {
        if (doc) {
            var zero = new Date('2018-07-23')
            var tmp = new Date(req.body.date)
            var week = Math.floor((tmp - zero) / (24 * 60 * 60 * 1000) / 7)
            const entry = new Entry({
                _id: new mongoose.Types.ObjectId(),
                userId: req.body.userId,
                duration: req.body.duration,
                length: req.body.length,
                week: week
            })
            entry.save().then(result => {
                res.status(201).json({
                    _id: result._id,
                    userId: result.userId,
                    duration: result.duration,
                    length: result.length,
                    week: result.week,
                    request: {
                        type1: 'DELETE PATCH',
                        url1: 'http://localhost:3000/entry/' + result._id,
                        type2: 'GET',
                        url2: 'http://localhost:3000/entry/us/' + result.userId
                    }
                })
            }).catch(error => {
                console.log(error)
                res.status(400).json({message: 'Wrong type of some fields'})
            })
        } else {
            res.status(404).json({message: 'User not found'})
        }
    }).catch(error => {
        console.log(error)
        res.status(400).json({message: 'Wrong userId'})
    })
})

router.use('/:entryId', checkAuth, function (req, res, next) {
    if (req.params.entryId !== undefined) {
        // Entry.findById(req.params.entryId).exec().then(result => {
        //   User.findById(result.userId).exec().then(user => {
        //     if (req.userData.userId.toString() === user._id.toString() || req.userData.rank > user.rank) {
        //       next()
        //     } else {
        //       return res.status(401).json({message: 'Unauthorised'})
        //     }
        //   }).catch(err => {
        //     console.log(err)
        //     return res.status(500).json({error: err})
        //   })
        // }).catch(err => {
        //   console.log(err)
        //   return res.status(400).json({error: 'Wrong entryId'})
        // })


        Entry.findById(req.params.entryId).exec().then(result => {
            return User.findById(result.userId).exec();
        }).then(user => {
            if (req.userData.userId.toString() === user._id.toString() || req.userData.rank > user.rank) {
                next()
            } else {
                return res.status(401).json({message: 'Unauthorised'})
            }
        }).catch(error => {
            console.log(err)
            return res.status(400).json({error: 'Something went wrong'})
        });
    } else {
        return res.status(400).json({message: 'Bad request'})
    }
})

router.get('/:entryId', function (req, res) {
    const id = req.params.entryId
    Entry.findById(id).exec().then(result => {
        if (result) {
            const response = {
                _id: result._id,
                userId: result.userId,
                duration: result.duration,
                length: result.length,
                week: result.week,
                request: {
                    type1: 'DELETE, PATCH',
                    url1: 'http://localhost:3000/entry/' + result._id,
                    type2: 'GET',
                    url2: 'http://localhost:3000/entry/us/' + result.userId
                }
            }
            res.status(200).json(response)
        } else {
            res.status(404).json({message: 'Not found'})
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

//  stavljanje novog unosa

//  uređivanje unosa
router.patch('/:entryId', function (req, res) {
    const id = req.params.entryId
    var zero = new Date('2018-07-23')
    var tmp = new Date(req.body.newDate)
    var week = Math.floor((tmp - zero) / (24 * 60 * 60 * 1000) / 7)
    Entry.update({_id: id}, {
        $set: {
            duration: req.body.newDuration,
            length: req.body.newLength,
            week: week
        }
    }).exec().then(result => {
        console.log(result)
        res.status(200).json({message: 'Entry updated'})
    }).catch(err => {
        console.log(err)
        res.status(400).json({error: 'Some of the fields are not valid'})
    })
})

//  brisanje unosa
router.delete('/:entryId', function (req, res) {
    const id = req.params.entryId
    Entry.remove({_id: id}).exec().then(result => {
        console.log(result)
        res.status(200).json({message: 'Entry deleted'})
    }).catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

router.use('/', (req, res, next) => {
    const error = new Error('Method not allowed')
    error.status = 405
    next(error)
})

module.exports = router
