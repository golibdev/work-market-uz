const { Router } = require('express')
const router = Router()
const { adminController } = require('../controllers')

router.post('/login', adminController.login)

module.exports = router