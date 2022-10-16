const { Router } = require('express')
const router = Router()

router.use('/admin', require('./adminRoutes'))
router.use('/region', require('./regionRoute'))
router.use('/category', require('./categoryRoute'))
router.use('/jobs-type', require('./jobsTypeRoutes'))
router.use('/language', require('./languageRoutes'))
router.use('/candidate', require('./candidateRoutes'))
router.use('/employer', require('./employerRoutes'))
router.use('/job', require('./jobsRoutes'))

module.exports = router