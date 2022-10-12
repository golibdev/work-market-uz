const { Candidate } = require('../models')
const { tokenDecode } = require('./tokenDecode')

exports.verifyCandidateToken = async (req, res, next) => {
   try {
      const tokenDecoded = tokenDecode(req);
      if(tokenDecoded) {
         const candidate = await Candidate.findById(tokenDecoded.id);
         if(!candidate) return res.status(401).json({ message: 'No allowed' });
         req.candidate = candidate;
         next();
      } else {
         return res.status(401).json({ message: 'Unauthorized' });
      }
   } catch (err) {
      console.log(err)
      res.status(500).json({ err: err })
   }
}