const { Router } = require('express')
const router = Router()
const { categoryController } = require('../controllers')
const { verifyAdmin } = require('../middlewares')

router.get('/', categoryController.getAll)
router.get('/:id', categoryController.getOne)
router.post('/', verifyAdmin.verifyAdminToken, categoryController.create)
router.put('/:id', verifyAdmin.verifyAdminToken, categoryController.update)
router.delete('/:id', verifyAdmin.verifyAdminToken, categoryController.delete)

module.exports = router