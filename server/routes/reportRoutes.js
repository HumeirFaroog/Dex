const express = require('express');
const multer = require('multer');
const path = require('path');
const { 
  uploadReport, 
  getReports, 
  getReportById, 
  updateReport, 
  deleteReport 
} = require('../controllers/reportController.js');
const { protect } = require('../middlewares/auth.js');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow PDF and image files
  if (file.mimetype === 'application/pdf' || 
      file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getReports)
  .post(upload.single('file'), uploadReport);

router.route('/:id')
  .get(getReportById)
  .put(updateReport)
  .delete(deleteReport);

module.exports = router;

