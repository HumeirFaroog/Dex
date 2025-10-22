const { getStorageMode } = require('../config/database.js');
const { 
  userStore, 
  appointmentStore, 
  reportStore, 
  aiAnalysisStore,
  populate,
  populateMany 
} = require('../storage/inMemoryStore.js');

// Adapter to use either MongoDB models or in-memory storage
const getModel = (modelName) => {
  const useInMemory = getStorageMode();
  
  if (useInMemory) {
    // Return in-memory store
    switch (modelName) {
      case 'User':
        return userStore;
      case 'Appointment':
        return appointmentStore;
      case 'Report':
        return reportStore;
      case 'AIAnalysis':
        return aiAnalysisStore;
      default:
        throw new Error(`Unknown model: ${modelName}`);
    }
  } else {
    // Return MongoDB model
    const models = {
      User: () => require('./User.js'),
      Appointment: () => require('./Appointment.js'),
      Report: () => require('./Report.js'),
      AIAnalysis: () => require('./AIAnalysis.js'),
    };
    
    return models[modelName]();
  }
};

// Helper to populate references (works for both MongoDB and in-memory)
const populateDoc = async (doc, fields) => {
  const useInMemory = getStorageMode();
  
  if (useInMemory) {
    return populate(doc, fields);
  } else {
    // For MongoDB, use populate method
    if (doc && typeof doc.populate === 'function') {
      return doc.populate(fields.join(' '));
    }
    return doc;
  }
};

const populateDocs = async (docs, fields) => {
  const useInMemory = getStorageMode();
  
  if (useInMemory) {
    return populateMany(docs, fields);
  } else {
    // For MongoDB, populate is already handled by query
    return docs;
  }
};

module.exports = {
  getModel,
  populateDoc,
  populateDocs
};

