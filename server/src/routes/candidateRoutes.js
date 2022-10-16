const router = require('express').Router();
const { candidateController } = require('../controllers');
const { verifyAdmin, verifyCandidate} = require('../middlewares/');

router.post('/register', candidateController.register);
router.post('/login', candidateController.login);
router.get('/', candidateController.getAll);
router.get('/:id', candidateController.getOne);
router.put('/info-update/:id', verifyCandidate.verifyCandidateToken, candidateController.update);
router.put('/password-update/:id', verifyCandidate.verifyCandidateToken, candidateController.updatePassword)
router.delete('/:id', verifyAdmin.verifyAdminToken, candidateController.delete);


module.exports = router;