const { Employer, Candidate, Job, Category, JobsType } = require('../models');
const CryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');
const { isValidObjectId } = require('mongoose');

exports.register = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password
        } = req.body

        const emailExist = await Employer.findOne({ email })
        || await Candidate.findOne({ email });

        if(emailExist) {
            return res.status(400).json({ message: 'email_exists' })
        }

        const encryptedPassword = CryptoJs.AES.encrypt(
                password,
                process.env.PASSWORD_SECRET_KEY
                ).toString()

        const newEmployer = new Employer({
            fullName,
            email,
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
            email,
            password
        } = req.body

        const employer = await Employer.findOne({ email });

        if(!employer) {
            return res.status(404).json({ message: 'email_or_password_error' })
        }

        const decryptedPass = CryptoJs.AES.decrypt(
                employer.password,
                process.env.PASSWORD_SECRET_KEY
                ).toString(CryptoJs.enc.Utf8)

        if(password !== decryptedPass) {
            return res.status(400).json({ message: 'email_or_password_error' })
        }

        const token = jwt.sign({
            id: employer._id
        }, process.env.TOKEN_SECRET_KEY)

        res.status(200).json({ message: 'successfuly_login', token, employer})
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
            return res.status(400).json({ message: 'error_id' })
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
            return res.status(400).json({ message: 'error_id' })
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