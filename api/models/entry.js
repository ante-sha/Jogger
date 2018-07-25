const mongoose = require('mongoose')

const entrySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  duration: {type: Number, required: true},
  length: {type: Number, required: true},
  date: {type: Date, required: true}
})

module.exports = mongoose.model('Entry', entrySchema)
//  VRIJEDNOSTI SU MIJENJANE
