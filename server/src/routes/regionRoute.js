const { Router } = require('express')
const router = Router()
const { regionController } = require('../controllers')
const { verifyAdmin } = require('../middlewares')

router.get('/', regionController.getAll)
router.get('/:id', regionController.getOne)
router.post('/', verifyAdmin.verifyAdminToken, regionController.create)
router.put('/:id', verifyAdmin.verifyAdminToken, regionController.update)
router.delete('/:id', verifyAdmin.verifyAdminToken, regionController.delete)

module.exports = router