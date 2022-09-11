const { model, Schema } = require('mongoose')
const { schemaOptions } = require('./schemaOptions')

const resumeSchema = new Schema({
   languages: [{
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Language' 
   }],
   educations: [{
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Education'
   }],
   expriences: [{
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Exprience'
   }],
   hardSkills: [{
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'HardSkill'
   }],
   softSkills: [{
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'SoftSkill'
   }]
}, schemaOptions)

module.exports = model('Resume', resumeSchema)