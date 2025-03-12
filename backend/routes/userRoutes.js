const express = require('express');
const {registerUser} = require('../controller/userController')
const router = express.Router();

router.post("/registerUser", registerUser);

module.exports = router;

