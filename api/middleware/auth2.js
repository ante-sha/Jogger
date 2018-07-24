const User = require('../models/users')

module.exports = (req, res, next) => {
  try {
    if (req.params.userId === undefined) {
      if (req.body.userId === req.userData.userId) {
        next()
      } else {
        User.findById(req.body.userId).exec().then(user => {
          if (user.rank < req.userData.rank) {
            next()
          } else {
            return res.status(401).json({message: 'Unauthorised'})
          }
        }).catch(err => {
          console.log(err)
          return res.status(404).json({error: 'Wrong userId'})
        })
      }
    } else {
      if (req.params.userId === req.userData.userId) {
        next()
      } else {
        User.findById(req.params.userId).exec().then(user => {
          if (user.rank < req.userData.rank) {
            next()
          } else {
            return res.status(401).json({message: 'Unauthorised'})
          }
        }).catch(err => {
          console.log(err)
          res.status(404).json({error: 'Wrong userId'})
        })
      }
    }
  } catch (error) {
    return res.status(401).json({error: 'Authorization failed'})
  }
}
