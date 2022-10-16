const { Router } = require('express');
const router = Router();
const { jobsController } = require('../controllers');
const { verifyAdmin, verifyEmployer } = require('../middlewares');

router.get('/', jobsController.getAll);
router.get('/:slugifyUrl', jobsController.getOne);
router.post('/', verifyEmployer.verifyEmployerToken, jobsController.create)

module.exports = router