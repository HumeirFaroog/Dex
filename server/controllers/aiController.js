const axios = require('axios');
const { getAIAnalysisModel, populateReference, populateReferences } = require('../utils/modelHelper.js');

const callAIAPI = async (symptoms) => {
  try {
    const response = await axios.post(
      process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.AI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a medical AI assistant. Analyze symptoms and provide possible diagnoses with probabilities, severity assessment, and recommended actions. Always emphasize that this is not a substitute for professional medical advice. Format your response as JSON with: possibleDiagnosis (array of {condition, probability, description}), severity (low/medium/high/critical), recommendedActions (array of strings), notes, and confidence (0-100).'
          },
          {
            role: 'user',
            content: `Analyze these symptoms: ${symptoms}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    
    // Try to parse JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (e) {
      // If not JSON, create structured response
      parsedResponse = {
        possibleDiagnosis: [{
          condition: 'General Assessment',
          probability: 0.5,
          description: aiResponse
        }],
        severity: 'medium',
        recommendedActions: ['Consult with a healthcare professional', 'Monitor symptoms'],
        notes: aiResponse,
        confidence: 60
      };
    }

    return parsedResponse;
  } catch (error) {
    console.error('AI API Error:', error.message);
    // Fallback response
    return {
      possibleDiagnosis: [{
        condition: 'Unable to analyze',
        probability: 0,
        description: 'AI service is currently unavailable. Please consult with a healthcare professional.'
      }],
      severity: 'medium',
      recommendedActions: ['Consult with a healthcare professional'],
      notes: 'AI analysis unavailable. Please seek professional medical advice.',
      confidence: 0
    };
  }
};

const analyzeSymptoms = async (req, res, next) => {
  try {
    const { symptoms } = req.body;
    const userId = req.user.id;

    // Call AI API
    const aiResponse = await callAIAPI(symptoms);

    // Save analysis to database
    const AIAnalysis = getAIAnalysisModel();
    const analysis = await AIAnalysis.create({
      patient: userId,
      inputType: 'symptoms',
      userInput: symptoms,
      aiResponse,
      aiModel: process.env.AI_MODEL || 'gpt-4'
    });

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    next(error);
  }
};

const analyzeReport = async (req, res, next) => {
  try {
    const { reportId, text } = req.body;
    const userId = req.user.id;

    const inputText = text || 'Please analyze this medical report';

    // Call AI API
    const aiResponse = await callAIAPI(inputText);

    // Save analysis to database
    const AIAnalysis = getAIAnalysisModel();
    const analysis = await AIAnalysis.create({
      patient: userId,
      report: reportId,
      inputType: 'report',
      userInput: inputText,
      aiResponse,
      aiModel: process.env.AI_MODEL || 'gpt-4'
    });

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    next(error);
  }
};

const getAnalyses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let query = {};
    if (role === 'patient') {
      query.patient = userId;
    } else if (role === 'doctor') {
      query.doctor = userId;
    }

    const AIAnalysis = getAIAnalysisModel();
    let analyses = await AIAnalysis.find(query);
    
    // Sort and limit
    analyses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    analyses = analyses.slice(0, 50);
    
    // Populate references
    analyses = await populateReferences(analyses, ['patient', 'doctor']);

    res.json({
      success: true,
      count: analyses.length,
      analyses
    });
  } catch (error) {
    next(error);
  }
};

const getAnalysisById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const AIAnalysis = getAIAnalysisModel();
    let analysis = await AIAnalysis.findById(id);
    
    // Populate references
    if (analysis) {
      analysis = await populateReference(analysis, ['patient', 'doctor']);
    }

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    // Check access
    if (role === 'patient' && analysis.patient._id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    next(error);
  }
};

const updateAnalysis = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { doctorNotes, isReviewed, accuracy } = req.body;

    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const AIAnalysis = getAIAnalysisModel();
    let analysis = await AIAnalysis.findByIdAndUpdate(
      id,
      {
        doctorNotes,
        isReviewed,
        accuracy,
        doctor: req.user.id
      },
      { new: true, runValidators: true }
    );
    
    // Populate references
    if (analysis) {
      analysis = await populateReference(analysis, ['patient']);
    }

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeSymptoms,
  analyzeReport,
  getAnalyses,
  getAnalysisById,
  updateAnalysis
};
