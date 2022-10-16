const { JobsType, Job } = require('../models')

exports.getAll = async (req, res) => {
    try {
        const jobsTypes = await JobsType.find({})
        .populate('jobs')
        .sort({ createdAt: -1 })

        if(!jobsTypes) {
            return res.status(404).json({ message: 'jobs_type_not_found' })
        }

        const total = await JobsType.countDocuments()

        res.status(200).json({
            jobsTypes,
            total
        })
    } catch (err) {
        res.status(501).json({ message: err.message })
    }
}

exports.getOne = async (req, res) => {
    try {
        const id = req.params.id

        const jobsType = await JobsType.findById(id).populate('jobs')

        if(!jobsType) {
            return res.status(404).json({ message: 'jobs_type_not_found' })
        }

        res.status(200).json({ jobsType })
    } catch (err) {
        res.status(501).json({ message: err.message })
    }
}

exports.create = async (req, res) => {
    try {
        const { title } = req.body

        const isJobsTypeExists = await JobsType.findOne({ title })

        if(isJobsTypeExists) {
            return res.status(404).json({ message: 'jobs_type_not_found' })
        }

        const newJobsType = new JobsType({ title })
        await newJobsType.save();

        res.status(201).json({ category: newJobsType, message: 'create_jobs_type' })
    } catch (err) {
        res.status(501).json({ message: err.message })
    }
}

exports.update = async (req, res) => {
    try {
        const id = req.params.id;

        const jobsType = await JobsType.findById(id);

        if(!jobsType) {
            res.status(404).json({ message: 'jobs_type_not_found' })
        }

        await JobsType.findByIdAndUpdate(id, req.body, { new: true })

        res.status(200).json({ message: 'success_updated' })
    } catch (err) {
        res.status(501).json({ message: err.message })
    }
}

exports.delete = async (req, res) => {
    try {
        const id = req.params.id

        const category = await JobsType.findById(id);

        if(!category) {
            res.status(404).json({ message: 'jobs_type_not_found' })
        }

        await Job.findOneAndDelete({ jobsTypeId: id })
        await JobsType.findByIdAndDelete(id)

        res.status(200).json({ message: 'success_deleted' })
    } catch (err) {
        res.status(501).json({ message: err.message })
    }
}