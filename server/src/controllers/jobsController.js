const { JobsType, Category, Employer, Job } = require('../models');
const path = require('path');
const fs = require('fs');
const slugify = require('slugify');
const { isValidObjectId } = require('mongoose');

exports.getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = 10
        const skipIndex = (page - 1) * limit

        const jobs = await Job.find({})
            .skip(skipIndex)
            .limit(limit)
            .sort({ createdAt: -1 })

        if(!jobs) {
            return res.status(404).json({ message: 'jobs_not_found' });
        }

        const total = await Job.countDocuments()

        res.status(200).json({
            jobs,
            pagination: {
                total,
                page,
                next: `/api/job?page=${page + 1}`
            }
        })
    } catch (err) {
        res.status(501).json({ message: err.message })
    }
}

exports.getOne = async (req, res) => {
    try {
        const slugifyUrl = req.params.slugifyUrl;

        const jobExists = await Job.findOne({ slugifyUrl });

        if(!jobExists) {
            return res.status(404).json({ message: 'job_not_found' });
        }

        res.status(200).json({ job: jobExists });
    } catch (err) {
        res.status(501).json({ message: err.message })
    }
}

exports.create = async (req, res) => {
    try {
        const id = req.employer.id
        const {
            title,
            description,
            salary,
            jobsTypeId,
            categoryId,
        } = req.body

        if(!isValidObjectId(jobsTypeId) || !isValidObjectId(categoryId)) {
            return res.status(400).json({ message: 'error_id' });
        }

        const jobsTypeExists = await JobsType.findById(jobsTypeId);

        if(!jobsTypeExists) {
            return res.status(400).json({ message: "jobs_type_not_found" });
        }

        const categoryExists = await Category.findById(categoryId);

        if(!categoryExists) {
            return res.status(400).json({ message: "category_not_found" });
        }

        const employer = await  Employer.findById(id);

        if(!employer) {
            return res.status(404).json({ message: 'employer_not_found' });
        }

        if(!req.files) {
            return res.status(400).json({ message: "file_not_found" });
        }

        const image = req.files.image;

        if(!image.mimetype.startsWith('image')) {
            return res.status(400).json({ message: "file_format_incorrect" });
        }

        if(image.size > process.env.MAX_FILE_SIZE) {
            return res.status(400).json({ message: "file_size_exceeded_2mb" });
        }

        image.name = `job_photo_${Date.now()}${path.parse(image.name).ext}`;

        image.mv(`public/uploads/jobsImage/${image.name}`, async (err) => {
            if(err) {
                return res.status(500).json({ message: 'error_uploading_file' })
            }
        })

        const slugifyUrl = slugify(title, {
            replacement: '-',
            remove: /[$*_+~.()'"!\-:@]/g,
            lower: true
        })

        const host = req.get('host');

        const newJob = await Job.create({
            title,
            slugifyUrl,
            description,
            salary,
            image: `${req.protocol}://${host}/uploads/jobsImage/${image.name}`,
            categoryId,
            jobsTypeId
        })

        await JobsType.findByIdAndUpdate(jobsTypeId, { $push: { jobs: newJob._id } });
        await Category.findByIdAndUpdate(categoryId, { $push: { jobs: newJob._id } });
        await Employer.findByIdAndUpdate(id, { $push: { jobs: newJob._id } });

        res.status(201).json({ message: 'jobs_created_successfully' });
    } catch (err) {
        res.status(501).json({ message: err.message })
    }
}