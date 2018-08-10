const mongoose = require('mongoose')

const entrySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  duration: {type: Number, min: 1, required: true},
  length: {type: Number, min: 1, required: true},
  date: {type: Date, required: true, min: '2018-08-01'}
})

module.exports = mongoose.model('Entry', entrySchema)
