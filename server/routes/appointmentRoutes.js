const express = require('express');
const { 
  createAppointment, 
  getAppointments, 
  getAppointmentById, 
  updateAppointment, 
  deleteAppointment 
} = require('../controllers/appointmentController.js');
const { protect, authorize } = require('../middlewares/auth.js');
const { appointmentValidation, validate } = require('../middlewares/validator.js');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAppointments)
  .post(appointmentValidation, validate(appointmentValidation), createAppointment);

router.route('/:id')
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(deleteAppointment);

module.exports = router;

