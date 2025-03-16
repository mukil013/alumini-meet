const express = require('express');
const {registerUser, validateUser, updateProfile} = require('../controller/userController')
const router = express.Router();

router.post("/registerUser", registerUser);
router.post("/validateUser", validateUser);

// http://localhost:8000/user/updateUserProfile/67d1df23d9d077f3baaef37b
router.patch("/updateUserProfile/:id", updateProfile);

module.exports = router;

