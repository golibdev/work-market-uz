const CryptoJS = require('crypto-js')
const { Admin } = require('../models')
const jwt = require('jsonwebtoken')

exports.login = async (req, res) => {
   try {
      const {
         username,
         password
      } = req.body

      const admin = await Admin.findOne({ username })

      if(!admin) {
         return res.status(400).json({ message: 'username_or_password_error' })
      }

      const decryptedPass = CryptoJS.AES.decrypt(
         admin.password,
         process.env.PASSWORD_SECRET_KEY
      ).toString(CryptoJS.enc.Utf8)

      if(password !== decryptedPass) {
         return res.status(400).json({ message: 'username_or_password_error' })
      }

      const token = jwt.sign({
         id: admin._id
      }, process.env.TOKEN_SECRET_KEY)

      admin.password = undefined

      res.status(200).json({ token, admin })
   } catch (err) {
      res.status(501).json({ message: err.message })
   }
}