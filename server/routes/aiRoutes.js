const express = require('express');
const { 
  analyzeSymptoms, 
  analyzeReport, 
  getAnalyses, 
  getAnalysisById, 
  updateAnalysis 
} = require('../controllers/aiController.js');
const { protect, authorize } = require('../middlewares/auth.js');
const { symptomValidation, validate } = require('../middlewares/validator.js');

const router = express.Router();

router.use(protect);

router.post('/symptoms', symptomValidation, validate(symptomValidation), analyzeSymptoms);
router.post('/report', analyzeReport);
router.get('/', getAnalyses);
router.get('/:id', getAnalysisById);
router.put('/:id', authorize('doctor', 'admin'), updateAnalysis);

module.exports = router;

