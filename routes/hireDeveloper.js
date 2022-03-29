const router = require('express').Router()
const hireDeveloper = require('../controllers/hireDeveloper')

router.get('/getRequirement/:page/:limit',hireDeveloper.getAllRequirement)
router.get('/singleRequirement/:id',hireDeveloper.singleRequirement)

module.exports = router