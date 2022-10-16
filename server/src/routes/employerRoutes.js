const { Router } = require('express');
const router = Router();
const { employerController } = require('../controllers');
const { verifyAdmin, verifyEmployer } = require('../middlewares');

router.post('/register', employerController.register);
router.post('/login', employerController.login);
router.get('/', verifyAdmin.verifyAdminToken, employerController.getAll);
router.get('/:id', verifyAdmin.verifyAdminToken, employerController.getOne);
router.put('/update-password', verifyEmployer.verifyEmployerToken, employerController.updatePassword);

module.exports = router