const { model, Schema } = require('mongoose')
const { schemaOptions } = require('./schemaOptions')

const adminSchema = new Schema({
   username: {
      type: String,
      required: true,
      unique: true
   }, 
   password: {
      type: String,
      required: true
   }
}, schemaOptions)

module.exports = model('Admin', adminSchema)