const { getAppointmentModel, getUserModel, populateReference, populateReferences } = require('../utils/modelHelper.js');

const createAppointment = async (req, res, next) => {
  try {
    const { doctor, appointmentDate, appointmentTime, reason, symptoms } = req.body;

    const Appointment = getAppointmentModel();
    const User = getUserModel();

    // Verify doctor exists and is a doctor
    const doctorUser = await User.findById(doctor);
    if (!doctorUser || doctorUser.role !== 'doctor') {
      return res.status(400).json({ message: 'Invalid doctor' });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor,
      appointmentDate,
      appointmentTime,
      reason,
      symptoms
    });

    // Populate references
    let populatedAppointment = appointment;
    if (typeof appointment.populate === 'function') {
      populatedAppointment = await appointment.populate('patient doctor');
    } else {
      populatedAppointment = await populateReference(appointment, ['patient', 'doctor']);
    }

    res.status(201).json({
      success: true,
      appointment: populatedAppointment
    });
  } catch (error) {
    next(error);
  }
};

const getAppointments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    const Appointment = getAppointmentModel();

    let query = {};
    if (role === 'patient') {
      query.patient = userId;
    } else if (role === 'doctor') {
      query.doctor = userId;
    }

    let appointments = await Appointment.find(query);
    
    // Sort appointments
    appointments.sort((a, b) => {
      const dateA = new Date(a.appointmentDate);
      const dateB = new Date(b.appointmentDate);
      if (dateB.getTime() !== dateA.getTime()) {
        return dateB - dateA;
      }
      return (b.appointmentTime || '').localeCompare(a.appointmentTime || '');
    });

    // Populate references
    appointments = await populateReferences(appointments, ['patient', 'doctor']);

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    next(error);
  }
};

const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const Appointment = getAppointmentModel();
    let appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Populate references
    if (typeof appointment.populate === 'function') {
      appointment = await appointment.populate('patient doctor');
    } else {
      appointment = await populateReference(appointment, ['patient', 'doctor']);
    }

    // Check access
    const patientId = appointment.patient?._id || appointment.patient;
    const doctorId = appointment.doctor?._id || appointment.doctor;
    
    if (role === 'patient' && patientId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (role === 'doctor' && doctorId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      appointment
    });
  } catch (error) {
    next(error);
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes, diagnosis, prescription } = req.body;

    const Appointment = getAppointmentModel();
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check authorization
    const patientId = appointment.patient?._id || appointment.patient;
    const doctorId = appointment.doctor?._id || appointment.doctor;
    const isPatient = patientId.toString() === req.user.id;
    const isDoctor = doctorId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Patients can only cancel
    if (isPatient && status && status !== 'cancelled') {
      return res.status(403).json({ message: 'Patients can only cancel appointments' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;
    if (diagnosis) updateData.diagnosis = diagnosis;
    if (prescription) updateData.prescription = prescription;

    let updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    // Populate references
    if (typeof updatedAppointment.populate === 'function') {
      updatedAppointment = await updatedAppointment.populate('patient doctor');
    } else {
      updatedAppointment = await populateReference(updatedAppointment, ['patient', 'doctor']);
    }

    res.json({
      success: true,
      appointment: updatedAppointment
    });
  } catch (error) {
    next(error);
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const Appointment = getAppointmentModel();
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only patient or admin can delete
    const patientId = appointment.patient?._id || appointment.patient;
    if (patientId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Appointment.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Appointment deleted'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
};

