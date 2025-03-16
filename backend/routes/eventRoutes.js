const express = require('express');
const {getAllEvents, addEvent, deleteEvent, editEvent} = require('../controller/eventController');
const router = express.Router();

// http://localhost:8000/event/getAllEvents
router.get('/getAllEvents', getAllEvents);
// http://localhost:8000/event/addEvents
router.post('/addEvents', addEvent);
// http://localhost:8000/event/deleteEvent/ event id
router.delete('/deleteEvent/:id', deleteEvent);
// http://localhost:8000/event/editEvent/ event id
router.patch('/editEvent/:id', editEvent);

module.exports = router;