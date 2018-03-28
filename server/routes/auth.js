var express = require('express');
var router = express.Router();
var fb = require('../middleware/facebook')
var auth = require('../controllers/auth')

router.get('/', fb , auth.signin )

module.exports = router;
