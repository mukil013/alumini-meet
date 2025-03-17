const express = require('express');
const {addProject, editProject, deleteProject, getAllProject, getUserProject} = require('../controller/projectController');
const router = express.Router();

// http://localhost:8000/project/getAllProject
router.get('/getAllProjects', getAllProject);
// http://localhost:8000/project/addProject/user id
router.post('/addProject/:id', addProject);
// http://localhost:8000/project/deleteProject/ project id
router.delete('/deleteProject/:id', deleteProject);
// http://localhost:8000/project/editProject/ project id
router.patch('/editProject/:id', editProject);
// http://localhost:8000/project/getUserProject/ user id
router.get('/getUserProject/:id', getUserProject);

module.exports = router;