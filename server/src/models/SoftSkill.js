const { model, Schema } = require('mongoose')
const { schemaOptions } = require('./schemaOptions')

const softSkillSchema = new Schema({
   title: {
      type: String,
      required: true,
      unique: true,
   }
}, schemaOptions)

module.exports = model('SoftSkill', softSkillSchema)