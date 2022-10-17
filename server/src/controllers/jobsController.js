const { JobsType, Category, Employer, Job } = require('../models');
const path = require('path');
const slugify = require('slugify');
const fs = require('fs')
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

exports.update = async (req, res) => {
    try {
        const id = req.params.id

        if(!isValidObjectId(id)) {
            return res.status(400).json({ message: 'error_id' });
        }

        const jobExists = await Job.findById(id);

        if(!jobExists) {
            return res.status(404).json({ message: 'job_not_found' })
        }

        if(req.files) {
            const oldImage = jobExists.image;
            const oldImageName = oldImage.split('/uploads/jobsImage/')[1]

            if(oldImage) {
                fs.unlinkSync(`public/uploads/jobsImage/${oldImageName}`)
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

            const host = req.get('host');

            await Job.findByIdAndUpdate(id, {
                image: `${req.protocol}://${host}/uploads/jobsImage/${image.name}`
            })
        }

        if(req.body.title) {
            const slugifyUrl = slugify(req.body.title, {
                replacement: '-',
                remove: /[$*_+~.()'"!\-:@]/g,
                lower: true
            })

            await Job.findByIdAndUpdate(id, { title: req.body.title, slugifyUrl })
        }

        if(req.body.categoryId) {
            const category = await Category.findById(req.body.categoryId)

            if(!category) {
                return res.status(404).json({ message: 'category_not_found' })
            }

            await Category.findByIdAndUpdate(jobExists.categoryId, {
                $pull: { jobs: jobExists._id }
            })

            await Category.findByIdAndUpdate(req.body.categoryId, {
                $push: { jobs: jobExists._id }
            })

            await Job.findByIdAndUpdate(id, { categoryId: req.body.categoryId })
        }

        if(req.body.jobsTypeId) {
            const jobsType = await JobsType.findById(req.body.jobsTypeId)

            if(!jobsType) {
                return res.status(404).json({ message: 'jobs_type_not_found' })
            }

            await JobsType.findByIdAndUpdate(jobExists.jobsTypeId, {
                $pull: { jobs: jobExists._id }
            })

            await JobsType.findByIdAndUpdate(req.body.jobsTypeId, {
                $push: { jobs: jobExists._id }
            })

            await Job.findByIdAndUpdate(id, { jobsTypeId: req.body.jobsTypeId })
        }

        await Job.findByIdAndUpdate(id, {
            description: req.body.description ? req.body.description : jobExists.description,
            salary: req.body.salary ? req.body.salary : jobExists.salary,
        }, { new: true })

        res.status(200).json({ message: 'update_job_info' });
    } catch(err) {
        res.status(501).json({ message: err.message })
    }
}