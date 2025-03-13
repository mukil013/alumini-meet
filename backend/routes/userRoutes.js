const express = require('express');
const {registerUser, validateUser} = require('../controller/userController')
const router = express.Router();

router.post("/registerUser", registerUser);
router.post("/validateUser", validateUser);

module.exports = router;

