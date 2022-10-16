const { Category, Job } = require('../models')

exports.getAll = async (req, res) => {
   try {
      const categories = await Category.find({})
      .populate('jobs')
      .sort({ createdAt: -1 })

      if(!categories) {
         return res.status(404).json({ message: 'categories_not_found' })  
      }

      const total = await Category.countDocuments()

      res.status(200).json({
         categories,
         total
      })
   } catch (err) {
      res.status(501).json({ message: err.message })
   }
}

exports.getOne = async (req, res) => { 
   try {
      const id = req.params.id

      const category = await Category.findById(id).populate('jobs')

      if(!category) {
         return res.status(404).json({ message: 'category_not_found' })
      }

      res.status(200).json({ category })
   } catch (err) {
      res.status(501).json({ message: err.message })
   }
}

exports.create = async (req, res) => {
   try {
      const { title } = req.body

      const isCategoryExists = await Category.findOne({ title })

      if(isCategoryExists) {
         return res.status(404).json({ message: 'category_not_found' })
      }

      const newCategory = new Category({ title });
      await newCategory.save();

      res.status(201).json({ category: newCategory })
   } catch (err) {
      res.status(501).json({ message: err.message })
   }
}

exports.update = async (req, res) => {
   try {
      const id = req.params.id;

      const category = await Category.findById(id);

      if(!category) {
         res.status(404).json({ message: 'category_not_found' })
      }

      await Category.findByIdAndUpdate(id, req.body, { new: true })

      res.status(200).json({ message: 'success_updated' })
   } catch (err) {
      res.status(501).json({ message: err.message })
   }
}

exports.delete = async (req, res) => {
   try {
      const id = req.params.id

      const category = await Category.findById(id);

      if(!category) {
         res.status(404).json({ message: 'category_not_found' })
      }

      await Job.findOneAndDelete({ categoryId: id })
      await Category.findByIdAndDelete(id)

      res.status(200).json({ message: 'success_deleted' })
   } catch (err) {
      res.status(501).json({ message: err.message })
   }
}