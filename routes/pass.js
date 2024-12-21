const express = require("express");
const router = express.Router();
const reset = require('../controller/passControl')
const nodemailer = require('../middlewares/email')

router.get('/send', reset.forget)
router.post('/send', reset.send)
router.get('/resetpass', reset.reset)
router.post('/resetpass', reset.resetPost)

module.exports = router;