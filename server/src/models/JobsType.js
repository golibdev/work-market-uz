const { model, Schema } = require('mongoose')
const { schemaOptions } = require('./schemaOptions')

const softSkillSchema = new Schema({
   title: {
      type: String,
      required: true,
      unique: true,
   },
   jobs: [{
      type: Schema.Types.ObjectId,
      ref: 'Job'
   }]
}, schemaOptions)

module.exports = model('JobsType', softSkillSchema)