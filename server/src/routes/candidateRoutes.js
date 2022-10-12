const router = require('express').Router();
const { candidateController } = require('../controllers');
const { verifyAdminToken } = require('../middlewares/adminTokenHandler');

router.post('/register', candidateController.register);
router.post('/login', candidateController.login);
router.get('/', verifyAdminToken, candidateController.getAll);
router.get('/:id', verifyAdminToken, candidateController.getOne);

module.exports = router;