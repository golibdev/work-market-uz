const { model, Schema } = require('mongoose')
const { schemaOptions } = require('./schemaOptions')

const categorySchema = new Schema({
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

module.exports = model('Category', categorySchema)