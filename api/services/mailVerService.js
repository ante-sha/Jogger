'use strict'
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

function setup () {
  return nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'e3147b1346c7b3',
      pass: 'dd86ce60864ad2'
    }
  })
}

function output (emailAdress) {
  return '<style>.top{cursor: default; padding: 10px;   text-align: center;   background-color: lightblue;} h1{  color: white;  text-align: center;  text-decoration: underline;} p{  font-family: verdana;  font-size: 20px;} a{position: relative;top: 20px;border-radius: 3px; background-color: grey;  font-size: 20px;  padding: 5px;  color: white; text-decoration: none; font-weight: bold; } .bot{font-size: 12px;    text-align: center;    margin-top: 50px;    text-decoration: overline;}</style><div class="top"><h1>Verification</h1><p>By clicking on "Verify" link you will verify your account on JOGGER app.</p></div><div class="top"><a href="http://localhost:8080/verify/' + jwt.sign({email: emailAdress}, 'kljuc', {expiresIn: '10h'}) + '">Verify</a></div><p class="bot">This is not your request? Contact us at jogger@jogger.com</p>'
}

module.exports = {
  sendConfirmationEmail (emailAdress) {
    return new Promise((resolve, reject) => {
      const transport = setup()
      const email = {
        from: '"mailtrap" <test@test.com>',
        to: emailAdress,
        subject: '[JOGGER] Account verification',
        text: 'dico mir',
        html: output(emailAdress)
      }
      transport.sendMail(email, (error, info) => {
        if (error) {
          reject(error)
        } else {
          resolve(info)
        }
      })
    })
  }
}
