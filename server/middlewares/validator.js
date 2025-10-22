const { body, validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      success: false,
      errors: errors.array()
    });
  };
};

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('role')
    .optional()
    .isIn(['patient', 'doctor', 'admin']).withMessage('Invalid role'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/).withMessage('Invalid phone number')
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
];

const appointmentValidation = [
  body('doctor')
    .notEmpty().withMessage('Doctor is required')
    .isMongoId().withMessage('Invalid doctor ID'),
  body('appointmentDate')
    .notEmpty().withMessage('Appointment date is required')
    .isISO8601().withMessage('Invalid date format'),
  body('appointmentTime')
    .notEmpty().withMessage('Appointment time is required')
    .trim(),
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters')
];

const symptomValidation = [
  body('symptoms')
    .notEmpty().withMessage('Symptoms are required')
    .trim()
    .isLength({ min: 10 }).withMessage('Please provide at least 10 characters describing your symptoms')
    .isLength({ max: 2000 }).withMessage('Symptoms description cannot exceed 2000 characters')
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  appointmentValidation,
  symptomValidation
};

