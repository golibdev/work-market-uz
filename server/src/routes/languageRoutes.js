const routes = require('express').Router()
const { languageController } = require('../controllers')
const { verifyAdmin } = require('../middlewares')

routes.get('/', languageController.getAll)
routes.get('/:id', languageController.getOne)
routes.post('/', verifyAdmin.verifyAdminToken, languageController.create)
routes.put('/:id', verifyAdmin.verifyAdminToken, languageController.update)
routes.delete('/:id', verifyAdmin.verifyAdminToken, languageController.delete)

module.exports = routes