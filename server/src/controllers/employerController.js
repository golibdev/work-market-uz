const { Employer, Candidate, Job, Category, JobsType } = require('../models');
const CryptoJs = require('crypto-js');
const slugify = require('slugify');
const jwt = require('jsonwebtoken');
const { isValidObjectId } = require('mongoose');
const fs = require('fs');
const path = require('path');

exports.register = async (req, res) => {
    try {
        const {
            fullName,
            phone,
            password
        } = req.body

        const phoneNumberExist = await Employer.findOne({ phone })
        || await Candidate.findOne({ phone });

        if(phoneNumberExist) {
            return res.status(401).json({ message: 'phone_number_exists' })
        }

        const encryptedPassword = CryptoJs.AES.encrypt(
                password,
                process.env.PASSWORD_SECRET_KEY
                ).toString()

        const newEmployer = new Employer({
            fullName,
            phone,
            password: encryptedPassword
        })

        await newEmployer.save()

        res.status(201).json({ message: 'successfuly_registered' })
    } catch (err) {
        res.status(501).json({ message: err.message })
    }
}

exports.login = async (req, res) => {
    try {
        const {
            phone,
            password
        } = req.body

        const employer = await Employer.findOne({ phone });

        if(!employer) {
            return res.status(404).json({ message: 'phone_or_password_error' })
        }

        const decryptedPass = CryptoJs.AES.decrypt(
                employer.password,
                process.env.PASSWORD_SECRET_KEY
                ).toString(CryptoJs.enc.Utf8)

        if(password !== decryptedPass) {
            return res.status(401).json({ message: 'phone_or_password_error' })
        }

        const token = jwt.sign({
            id: employer._id
        }, process.env.TOKEN_SECRET_KEY)

        res.status(200).json({ message: 'successfuly_login', token, employer})
    } catch (err) {
        res.status(501).json({ message: err.message })
    }
}

exports.createNewJob = async (req, res) => {
    try {
        const id = req.params.id;

        const {
            title,
            description,
            salary,
            jobsTypeId,
            categoryId
        } = req.body

        if(!isValidObjectId(id) || !isValidObjectId(jobsTypeId) || !isValidObjectId(categoryId)) {
            return res.status(401).json({ message: 'error_id' });
        }

        const jobsTypeExists = await JobsType.findById(jobsTypeId);

        if(!jobsTypeExists) {
            return res.status(401).json({ message: "jobs_type_not_found" });
        }

        const categoryExists = await Category.findById(categoryId);

        if(!categoryExists) {
            return res.status(401).json({ message: "category_not_found" });
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

        const newJob = new Job({
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

exports.getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = 10
        const skipIndex = (page - 1) * limit

        const employers = await Employer.find()
        .skip(skipIndex)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('jobs')

        if(!employers) {
            return res.status(404).json({ message: "employers_not_found" })
        }

        const total = await Employer.countDocuments();

        res.status(200).json({
            employers,
            pagination: {
                total,
                page,
                next: `/api/employer?page=${page + 1}`
            }
        })
    } catch (err) {
        res.status(501).json({ message: err.message })
    }
}

exports.getOne = async (req, res) => {
    try {
        const id = req.params.id

        if(!isValidObjectId(id)) {
            return res.status(401).json({ message: 'error_id' })
        }

        const employer = await Employer.findById(id).populate('jobs');

        if(!employer) {
            return res.status(404).json({ message: 'employer_not_found' });
        }

        res.status(200).json({ employer })
    } catch (err) {
        res.status(501).json({ message: err.message })
    }
}

exports.updatePassword = async (req, res) => {
    try {
        const id = req.params.id;

        if(!isValidObjectId(id)) {
            return res.status(401).json({ message: 'error_id' })
        }

        const employer = await Employer.findById(id);

        if(!employer) {
            return res.status(404).json({ message: 'employer_not_found' });
        }

        const encryptedPassword = CryptoJs.AES.encrypt(
                req.body.password,
                process.env.PASSWORD_SECRET_KEY
                ).toString();

        await Employer.findByIdAndUpdate(id, { password: encryptedPassword }, { new: true });

        res.status(200).json({ message: 'employer_password_update' });
    } catch (err) {
        res.status(501).json({ message: err.message })
    }
}