const express = require('express');
const {getAllPlacement, addPlacement, editPlacement, deletePlacement} =  require('../controller/placementController');
const router = express.Router();
// http://localhost:8000/placement/getPlacement
router.get('/getPlacement', getAllPlacement);
// http://localhost:8000/placement/addPlacement
router.post('/addPlacement', addPlacement);
// http://localhost:8000/placement/deletePlacement/ placement blog id
router.delete('/deletePlacement/:id', deletePlacement);
// http://localhost:8000/placement/editPlacement/placement blog id
router.patch('/editPlacement', editPlacement);

module.exports = router;