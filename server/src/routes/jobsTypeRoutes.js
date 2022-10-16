const { Router } = require('express')
const router = Router()
const { jobsTypeController } = require('../controllers')
const { verifyAdmin } = require('../middlewares')

router.get('/', jobsTypeController.getAll)
router.get('/:id', jobsTypeController.getOne)
router.post('/', verifyAdmin.verifyAdminToken, jobsTypeController.create)
router.put('/:id', verifyAdmin.verifyAdminToken, jobsTypeController.update)
router.delete('/:id', verifyAdmin.verifyAdminToken, jobsTypeController.delete)

module.exports = router