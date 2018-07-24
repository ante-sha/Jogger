const mongoose = require('mongoose')

const entrySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  duration: {type: Number, required: true},
  length: {type: Number, required: true},
  week: {type: Number, required: true, min: 0}
})

module.exports = mongoose.model('Entry', entrySchema)
//  VRIJEDNOSTI SU MIJENJANE
