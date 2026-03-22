const express    = require('express');
const router     = express.Router();
const protect    = require('../middleware/auth');
const roleCheck  = require('../middleware/roleCheck');
const {
  getAllEvents, getEvent, createEvent, updateEvent,
  deleteEvent, registerForEvent, unregisterFromEvent
} = require('../controllers/eventController');

router.get('/',              getAllEvents);
router.get('/:id',           getEvent);
router.post('/',             protect, roleCheck('organizer','admin'), createEvent);
router.put('/:id',           protect, roleCheck('organizer','admin'), updateEvent);
router.delete('/:id',        protect, roleCheck('organizer','admin'), deleteEvent);
router.post('/:id/register', protect, registerForEvent);
router.delete('/:id/register', protect, unregisterFromEvent);

module.exports = router;
