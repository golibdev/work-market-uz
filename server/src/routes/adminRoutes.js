const { Router } = require('express')
const router = Router()
const { adminController } = require('../controllers')
const { verifyAdmin } = require('../middlewares')

router.post('/login', adminController.login)
router.put('/:id', verifyAdmin.verifyAdminToken, adminController.update)

module.exports = router