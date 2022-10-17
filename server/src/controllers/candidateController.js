const { Candidate, Employer } = require('../models')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')
const { isValidObjectId } = require('mongoose')
const { generateRandomNumber } = require('../handlers/generateRandomNumber')
const  nodemailer = require("nodemailer");

exports.register = async (req, res) => {
   try {
      const {
         fullName,
         email,
         password
      } = req.body

      const emailExist = await Candidate.findOne({ email })
         || await Employer.findOne({ email })

       if(emailExist) {
         return res.status(400).json({ message: 'email_exists' })
      }

      const encryptedPassword = CryptoJS.AES.encrypt(
         password, 
         process.env.PASSWORD_SECRET_KEY
      ).toString()

      const newCandidate = new Candidate({
         fullName,
         email,
         password: encryptedPassword
      })

      await newCandidate.save()

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

      const candidate = await Candidate.findOne({ email });

      if(!candidate) {
         return res.status(404).json({ message: 'email_or_password_error' })
      }

      const decryptedPass = CryptoJS.AES.decrypt(
         candidate.password,
         process.env.PASSWORD_SECRET_KEY
      ).toString(CryptoJS.enc.Utf8)

      if(password !== decryptedPass) {
         return res.status(400).json({ message: 'email_or_password_error' })
      }

      const token = jwt.sign({
         id: candidate._id
      }, process.env.TOKEN_SECRET_KEY)

      res.status(200).json({ message: 'successfuly_login', token, candidate})
   } catch (err) {
      res.status(501).json({ message: err.message })
   }
}

exports.getAll = async (req, res) => {
   try {
      const page = parseInt(req.query.page) || 1
      const limit = 10
      const skipIndex = (page - 1) * limit

      const candidates = await Candidate.find()
         .skip(skipIndex)
         .limit(limit)
         .sort({ createdAt: -1 })
         .populate('resumes')

      if(!candidates) {
         return res.status(404).json({ message: "candidates_not_found" })
      }

      const total = await Candidate.countDocuments();

      res.status(200).json({
         candidates,
         pagination: {
            total,
            page,
            next: `/api/candidate?page=${page + 1}`
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

      const candidate = await Candidate.findById(id).populate('resumes');

      if(!candidate) {
         return res.status(404).json({ message: 'candidate_not_found' });
      }

      res.status(200).json({ candidate })
   } catch (err) {
      res.status(501).json({ message: err.message })
   }
}

exports.update = async (req, res) => {
   try {
      const id = req.params.id;

      if(!isValidObjectId(id)) {
         return res.status(400).json({ message: 'error_id' });
      }

      const candidate = await Candidate.findById(id);

      if(!candidate) {
         return res.status(404).json({ message: 'candidate_not_found' })
      }

      const {
         about,
         speciality
      } = req.body

      await Candidate.findByIdAndUpdate(id, { about, speciality }, { new: true });

      res.status(200).json({ message: 'candidate_info_updated' });
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
      
      const candidate = await Candidate.findById(id);

      if(!candidate) {
         return res.status(404).json({ message: 'candidate_not_found' });
      }

      const encryptedPassword = CryptoJS.AES.encrypt(
         req.body.password, 
         process.env.PASSWORD_SECRET_KEY
      ).toString();

      await Candidate.findByIdAndUpdate(id, { password: encryptedPassword }, { new: true });

      res.status(200).json({ message: 'candidate_password_update' });
   } catch (err) {
      res.status(501).json({ message: err.message })
   }
}

exports.delete = async (req, res) => {
   try {
      const id = req.params.id;

      if(!isValidObjectId(id)) {
         return res.status(400).json({ message: 'error_id' });
      }

      const candidate = await Candidate.findById(id);

      if(!candidate) {
         return res.status(404).json({ message: 'candidate_not_found' })
      }

      await Candidate.findByIdAndDelete(id);

      res.status(200).json({ message: 'candidate_deleted' });
   } catch (err) {
      res.status(501).json({ message: err.message })
   }
}