const mongoose = require('mongoose')

const reportSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  week: {type: Number, required: true},
  duration: {type: Number, reqiured: true},
  length: {type: Number, reqiured: true}
})

module.exports = mongoose.model('Report', reportSchema)
