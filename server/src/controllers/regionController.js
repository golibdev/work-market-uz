const { Region } = require('../models')

exports.getAll = async (req, res) => {
   try {
      const regions = await Region.find({}).sort({ createdAt: -1 })

      if(!regions) {
         return res.status(404).json({ message: 'regions_not_found' })  
      }

      const total = await Region.countDocuments()

      res.status(200).json({
         regions,
         total
      })
   } catch (err) {
      res.status(501).json({ message: err.message })
   }
}

exports.getOne = async (req, res) => {
   try {
      const id = req.params.id

      const region = await Region.findById(id)

      if(!region) {
         return res.status(404).json({ message: 'region_not_found' })
      }

      res.status(200).json({ region })
   } catch (err) {
      res.status(501).json({ message: err.message })
   }
}

exports.create = async (req, res) => {
   try {
      const { title } = req.body

      const isRegionExists = await Region.findOne({ title })

      if(isRegionExists) {
         return res.status(404).json({ message: 'region_not_found' })
      }

      const newRegion = new Region({ title })
      
      await newRegion.save()

      res.status(201).json({ region: newRegion })
   } catch (err) {
      res.status(501).json({ message: err.message })
   }
}

exports.update = async (req, res) => {
   try {
      const id = req.params.id;

      const region = await Region.findById(id);

      if(!region) {
         res.status(404).json({ message: 'region_not_found' })
      }

      await Region.findByIdAndUpdate(id, req.body, { new: true })

      res.status(200).json({ message: 'success_updated' })
   } catch (err) {
      res.status(501).json({ message: err.message })
   }
}

exports.delete = async (req, res) => {
   try {
      const id = req.params.id

      const region = await Region.findById(id);

      if(!region) {
         res.status(404).json({ message: 'region_not_found' })
      }

      await Region.findByIdAndDelete(id)

      res.status(200).json({ message: 'success_deleted' })
   } catch (err) {
      res.status(501).json({ message: err.message })
   }
}