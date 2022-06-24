const router = require('express').Router()
const auth =require('../middleware/access')
const testRequestCtrl =require('../controllers/testRequestCtrl')


router.get('/getRequest',testRequestCtrl.getAllRequest)


router.post('/newRequest',testRequestCtrl.create)
router.post('/createOrganization',testRequestCtrl.createOrganization)


module.exports = router