const { Employer } = require('../models')
const { tokenDecode } = require('./tokenDecode')

exports.verifyEmployerToken = async (req, res, next) => {
    try {
        const tokenDecoded = tokenDecode(req);
        if(tokenDecoded) {
            const employer = await Employer.findById(tokenDecoded.id);
            if(!employer) return res.status(401).json({ message: 'No allowed' });
            req.employer = employer;
            next();
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: err })
    }
}