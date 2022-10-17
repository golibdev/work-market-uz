const { Router } = require('express');
const router = Router();
const { jobsController } = require('../controllers');
const { verifyEmployer } = require('../middlewares');

router.get('/', jobsController.getAll);
router.get('/:slugifyUrl', jobsController.getOne);
router.post('/', verifyEmployer.verifyEmployerToken, jobsController.create);
router.put('/:id', verifyEmployer.verifyEmployerToken, jobsController.update);

module.exports = router