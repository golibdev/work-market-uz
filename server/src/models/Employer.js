const { model, Schema } = require('mongoose')
const { schemaOptions } = require('./schemaOptions')

const employerSchema = new Schema({
   fullName: {
      type: String,
      required: true
   },
   phone: {
      type: String,
      required: true,
      unique: true
   },
   jobs: [{
      type: Schema.Types.ObjectId,
      ref: 'Job'
   }]
}, schemaOptions)

module.exports = model('Employer', employerSchema)