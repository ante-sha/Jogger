const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const entryRoutes = require('./api/routes/entry')
const reportsRoutes = require('./api/routes/reports')
const usersRoutes = require('./api/routes/users')
const manageRoutes = require('./api/routes/manage')

mongoose.connect('mongodb://localhost/27017')

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PATCH, DELETE, GET, POST ')
    return res.status(200).json({})
  }
  next()
})

app.use('/entry', entryRoutes)
app.use('/reports', reportsRoutes)
app.use('/users', usersRoutes)
app.use('/manage', manageRoutes)

app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app
