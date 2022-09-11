const { model, Schema } = require('mongoose')
const { schemaOptions } = require('./schemaOptions')

const hardSkillSchema = new Schema({
   title: {
      type: String,
      required: true,
      unique: true,
   }
}, schemaOptions)

module.exports = model('HardSkill', hardSkillSchema)