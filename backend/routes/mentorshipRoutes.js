const express = require('express');
const { AddGroup, EditGroup, GetAllGroup, GetGroupById, DeleteGroup } = require("../controller/mentorshipController")
const router = express.Router();


router.delete("/delete/:id", DeleteGroup)
router.get("/get/:id", GetGroupById)
router.get("/getAll", GetAllGroup)
router.patch("/edit/:id", upload.single("image"), EditGroup)
router.post("/add", upload.single("image"), AddGroup)

module.exports = router;