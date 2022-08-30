const { Router } = require('express')
const router = Router()

router.use('/users', require('./userRoutes'))

module.exports = router