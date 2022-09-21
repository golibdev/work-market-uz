const { Router } = require('express')
const router = Router()

router.use('/admin', require('./adminRoutes'))
router.use('/region', require('./regionRoute'))
router.use('/category', require('./categoryRoute'))
router.use('/language', require('./languageRoutes'))

module.exports = router