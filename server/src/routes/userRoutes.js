const { Router } = require('express')
const router = Router()
const { userControllers } = require('../controllers')

router.get('/', userControllers.testing)

module.exports = router