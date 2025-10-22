const { getStorageMode } = require('../config/database.js');
const { 
  userStore, 
  appointmentStore, 
  reportStore, 
  aiAnalysisStore,
  populate,
  populateMany 
} = require('../storage/inMemoryStore.js');
const User = require('../models/User.js');
const Appointment = require('../models/Appointment.js');
const Report = require('../models/Report.js');
const AIAnalysis = require('../models/AIAnalysis.js');

// Helper to get the appropriate model/store
const getUserModel = () => {
  return getStorageMode() ? userStore : User;
};

const getAppointmentModel = () => {
  return getStorageMode() ? appointmentStore : Appointment;
};

const getReportModel = () => {
  return getStorageMode() ? reportStore : Report;
};

const getAIAnalysisModel = () => {
  return getStorageMode() ? aiAnalysisStore : AIAnalysis;
};

// Helper to populate references
const populateReference = async (doc, fields) => {
  const useInMemory = getStorageMode();
  
  if (useInMemory) {
    return populate(doc, fields);
  } else {
    if (doc && typeof doc.populate === 'function') {
      return doc.populate(fields.join(' '));
    }
    return doc;
  }
};

const populateReferences = async (docs, fields) => {
  const useInMemory = getStorageMode();
  
  if (useInMemory) {
    return populateMany(docs, fields);
  } else {
    // MongoDB handles population in query
    return docs;
  }
};

// Helper to handle select('+password') for in-memory
const findUserWithPassword = async (query) => {
  const useInMemory = getStorageMode();
  
  if (useInMemory) {
    return userStore.findOne(query);
  } else {
    return User.findOne(query).select('+password');
  }
};

module.exports = {
  getUserModel,
  getAppointmentModel,
  getReportModel,
  getAIAnalysisModel,
  populateReference,
  populateReferences,
  findUserWithPassword
};

