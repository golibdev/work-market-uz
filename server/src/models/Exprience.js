const { model, Schema } = require('mongoose')
const { schemaOptions } = require('./schemaOptions')

const exprienceSchema = new Schema({
   speciality: {
      type: String,
      required: true
   },
   from: {
      type: String,
      required: true,
   },
   date: {
      type: Date,
      required: true
   }
}, schemaOptions)

module.exports = model('Exprience', exprienceSchema)