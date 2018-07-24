const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    var token = req.headers['authorization']
    const decoded = jwt.verify(token.split(' ')[1], 'kljuc')
    req.userData = decoded
    next()
  } catch (error) {
    return res.status(401).json({message: 'Auth failed'})
  }
}
