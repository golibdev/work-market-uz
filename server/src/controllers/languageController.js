const { Language } = require('../models')

exports.getAll = async (req, res) => {
   try {
      const languages = await Language.find()

      if(!languages) {
         return res.status(404).json({ message: 'not_languages' })
      }

      res.status(200).json({ languages });
   } catch (err) {
      res.status(501).json({ message: err.message })
   }
}

exports.getOne = async (req, res) => {
   try {
      const id = req.params.id

      const language = await Language.findById(id);

      if(!language) {
         return res.status(404).json({ message: 'not_language' })
      }

      res.status(200).json({ language: language })
   } catch (err) {
      res.status(501).json({ message: err.message })
   }
}

exports.create = async (req, res) => {
   try {
      const title = req.body.title

      const languageExists = await Language.findOne({ title })

      if(languageExists) {
         return res.status(401).json({ message: 'language_exists' })
      }

      const newLanguage = await Language.create({
         title
      })

      await newLanguage.save()

      res.status(201).json({ language: newLanguage })
   } catch (err) {
      res.status(501).json({ message: err.message })
   }
}

exports.update = async (req, res) => {
   try {
      const id = req.params.id

      const languageExists = await Language.findOne({ title: req.body.title })

      if(languageExists) {
         return res.status(401).json({ message: 'language_exists' })
      }

      await Language.findByIdAndUpdate(id, { title: req.body.title }, { new: true })

      res.status(200).json({ message: 'language_updated' });
   } catch (err) {
      res.status(501).json({ message: err.message })
   }
}

exports.delete = async (req, res) => {
   try {
      const id = req.params.id

      const languageExists = await Language.findById(id)

      if(!languageExists) {
         return res.status(401).json({ message: 'language_exists' })
      }

      await Language.findByIdAndRemove(id);

      res.status(200).json({ message: 'deleted_languages' });
   } catch (err) {
      res.status(501).json({ message: err.message })
   }
}