const { model, Schema } = require('mongoose')
const { schemaOptions } = require('./schemaOptions')

const candidateSchema = new Schema({
   fullName: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true,
      unique: true
   },
   password: {
      type: String,
      required: true
   },
   about: {
      type: String
   },
   speciality: {
      type: String
   },
   regionId: {
      type: Schema.Types.ObjectId,
      ref: 'Region'
   },
   resumes: [{
      type: Schema.Types.ObjectId,
      ref: 'Resume'
   }]
}, schemaOptions)

module.exports = model('Candidate', candidateSchema)