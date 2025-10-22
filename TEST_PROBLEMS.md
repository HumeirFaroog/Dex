# 30-Minute Technical Assessment Problems

## Instructions
- **Total Time:** 30 minutes
- **Choose ONE role** and complete BOTH problems for that role
- Each problem should take approximately 10-15 minutes
- Focus on demonstrating your problem-solving approach and coding skills
- You may use any resources (documentation, Stack Overflow, etc.)

---

## 🎨 Frontend Developer

### Problem 1: React Component Bug Fix (15 min)
**Scenario:** The patient dashboard is showing incorrect appointment counts. The component is not properly filtering appointments by the current user.

**Task:**
1. Identify the bug in the `PatientDashboard.jsx` component
2. Fix the filtering logic to show only the current patient's appointments
3. Ensure the statistics cards display correct counts

**Files to check:**
- `client/src/pages/patient/PatientDashboard.jsx`
- `client/src/services/appointmentService.js`

**Expected behavior:**
- Statistics should show only the logged-in patient's appointments
- Recent appointments list should only show the current patient's appointments

---

### Problem 2: Form Validation Enhancement (15 min)
**Scenario:** The appointment booking form needs better validation and user feedback.

**Task:**
1. Add real-time validation to the appointment booking form
2. Show error messages for:
   - Date must be in the future
   - Time must be during business hours (9 AM - 5 PM)
   - Doctor selection is required
   - Reason field must be at least 10 characters
3. Disable submit button when form is invalid
4. Show success message after successful submission

**Files to modify:**
- `client/src/pages/patient/Appointments.jsx`

**Requirements:**
- Use React state for validation
- Display inline error messages
- Style errors with red text/border
- Show success toast/alert after booking

---

## ⚙️ Backend Developer

### Problem 1: API Endpoint Performance (15 min)
**Scenario:** The `/api/users/stats` endpoint is slow when there are many users. It's fetching all users and calculating statistics in memory.

**Task:**
1. Optimize the `getStats` function in `userController.js`
2. Use aggregation or efficient filtering instead of loading all users
3. Add caching mechanism (simple in-memory cache with 5-minute TTL)
4. Ensure it works for both MongoDB and in-memory storage

**Files to modify:**
- `server/controllers/userController.js`
- `server/utils/modelHelper.js` (if needed)

**Requirements:**
- Response time should be < 100ms for 1000+ users
- Cache should expire after 5 minutes
- Cache should be cleared when new users are created

---

### Problem 2: Error Handling & Logging (15 min)
**Scenario:** The application needs better error handling and logging for debugging production issues.

**Task:**
1. Create a centralized error logging utility
2. Log errors with:
   - Timestamp
   - Error message
   - Stack trace
   - User ID (if available)
   - Request path and method
3. Update the error handler middleware to use the new logger
4. Add different log levels (error, warn, info)

**Files to create/modify:**
- `server/utils/logger.js` (new file)
- `server/middlewares/errorHandler.js`

**Requirements:**
- Log to console in development
- Include all relevant context
- Format logs as JSON for production
- Don't log sensitive data (passwords, tokens)

---

## 🤖 AI Developer

### Problem 1: AI Prompt Optimization (15 min)
**Scenario:** The AI symptom analysis is not providing accurate or structured responses. The current prompt needs improvement.

**Task:**
1. Review the current AI prompt in `server/controllers/aiController.js`
2. Optimize the prompt to:
   - Get more accurate diagnoses
   - Ensure structured JSON response
   - Include severity assessment
   - Provide actionable recommendations
3. Add prompt validation and error handling
4. Test with sample symptoms

**Files to modify:**
- `server/controllers/aiController.js`

**Requirements:**
- Prompt should request structured JSON response
- Include severity levels (low, medium, high, critical)
- Request probability scores for diagnoses
- Ask for specific recommended actions
- Handle API errors gracefully

---

### Problem 2: AI Response Processing & Validation (15 min)
**Scenario:** AI responses sometimes come in unexpected formats or contain errors. Need robust parsing and validation.

**Task:**
1. Create a function to parse and validate AI responses
2. Handle cases where:
   - Response is not valid JSON
   - Required fields are missing
   - Response format is unexpected
3. Add default values for missing fields
4. Log parsing errors for debugging
5. Return a standardized response structure

**Files to create/modify:**
- `server/utils/aiResponseParser.js` (new file)
- `server/controllers/aiController.js` (use the parser)

**Requirements:**
- Parse JSON safely (try-catch)
- Validate required fields exist
- Provide sensible defaults
- Log errors without exposing to users
- Always return valid response structure

---

## 🎨 UI/UX Designer

### Problem 1: Responsive Design Fix (15 min)
**Scenario:** The admin dashboard looks broken on mobile devices. Cards are overlapping and text is too small.

**Task:**
1. Analyze the responsive design issues in `AdminDashboard.jsx`
2. Fix the layout for mobile screens (< 768px):
   - Stack cards vertically
   - Make text readable (minimum 14px)
   - Ensure buttons are easily tappable (min 44x44px)
   - Fix navigation menu for mobile
3. Test on different screen sizes

**Files to modify:**
- `client/src/pages/admin/AdminDashboard.jsx`
- `client/src/components/Layout.jsx` (mobile menu)

**Requirements:**
- Mobile-first approach
- Touch-friendly interface
- No horizontal scrolling
- Maintain visual hierarchy

---

### Problem 2: Accessibility Improvements (15 min)
**Scenario:** The application needs better accessibility for users with disabilities.

**Task:**
1. Add ARIA labels to interactive elements
2. Ensure keyboard navigation works:
   - All buttons/links are focusable
   - Tab order is logical
   - Focus indicators are visible
3. Improve color contrast (WCAG AA compliance)
4. Add alt text to icons/images
5. Test with screen reader (if available)

**Files to modify:**
- `client/src/components/Button.jsx`
- `client/src/components/Input.jsx`
- `client/src/pages/patient/SymptomChecker.jsx`

**Requirements:**
- All interactive elements have ARIA labels
- Keyboard navigation works smoothly
- Focus indicators are visible
- Color contrast ratio ≥ 4.5:1 for text

---

## 🚀 DevOps

### Problem 1: Environment Configuration (15 min)
**Scenario:** The application needs better environment variable management and validation.

**Task:**
1. Create a `.env.example` file with all required variables
2. Add environment variable validation on server startup
3. Create a script to check if all required env vars are set
4. Add helpful error messages if variables are missing

**Files to create/modify:**
- `server/.env.example` (new file)
- `server/config/env.js` (new file)
- `server/server.js` (add validation)

**Required variables to validate:**
- `PORT` (optional, default: 5000)
- `JWT_SECRET` (optional, with warning)
- `OPENAI_API_KEY` (required for AI features)
- `CLIENT_URL` (optional, default: http://localhost:5173)
- `MONGODB_URI` (optional, uses in-memory if not set)

**Requirements:**
- Clear error messages
- Validation runs on startup
- Example file shows all options
- Graceful fallbacks where appropriate

---

### Problem 2: Build & Deployment Script (15 min)
**Scenario:** Need a script to build and prepare the application for production deployment.

**Task:**
1. Create a build script that:
   - Builds the frontend (React)
   - Validates environment variables
   - Creates production-ready bundle
   - Generates a deployment checklist
2. Add a health check endpoint (`/health`)
3. Create a simple deployment guide

**Files to create/modify:**
- `package.json` (add build:prod script)
- `server/routes/healthRoutes.js` (new file)
- `DEPLOYMENT.md` (new file)

**Requirements:**
- Build script runs all checks
- Health endpoint returns server status
- Deployment guide is clear and concise
- Script handles errors gracefully

---

## 🧪 QA (Quality Assurance)

### Problem 1: Test Case Creation (15 min)
**Scenario:** The login functionality needs comprehensive test coverage.

**Task:**
1. Write test cases for the login feature covering:
   - Valid login
   - Invalid email
   - Invalid password
   - Empty fields
   - Case-insensitive email
   - Account deactivated
   - Network errors
2. Create test cases in a structured format
3. Include expected results and test data

**Files to create:**
- `tests/test-cases/login-test-cases.md` (new file)

**Test case format:**
```
Test Case ID: TC-LOGIN-001
Description: Valid user login
Preconditions: User exists in system
Test Steps:
  1. Navigate to /login
  2. Enter valid email: patient@example.com
  3. Enter valid password: password123
  4. Click "Login" button
Expected Result: User is redirected to dashboard
Actual Result: [To be filled]
Status: [Pass/Fail]
```

**Requirements:**
- Minimum 7 test cases
- Cover positive and negative scenarios
- Include edge cases
- Clear and detailed steps

---

### Problem 2: Bug Report & Reproduction (15 min)
**Scenario:** A user reported that appointments are not being filtered correctly on the doctor dashboard.

**Task:**
1. Reproduce the bug (if possible, or describe how to reproduce)
2. Write a detailed bug report including:
   - Bug title
   - Description
   - Steps to reproduce
   - Expected vs Actual behavior
   - Screenshots/evidence (describe if can't capture)
   - Severity and priority
   - Environment details
3. Suggest a potential fix

**Files to check:**
- `client/src/pages/doctor/DoctorDashboard.jsx`
- `server/controllers/appointmentController.js`

**Bug Report Template:**
```
**Bug Title:** [Clear, concise title]

**Description:**
[Detailed description of the issue]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Severity:** [Critical/High/Medium/Low]
**Priority:** [P1/P2/P3/P4]

**Environment:**
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- User Role: [e.g., Doctor]

**Suggested Fix:**
[Your suggestion]
```

**Requirements:**
- Clear reproduction steps
- Detailed description
- Appropriate severity/priority
- Actionable bug report

---

## 📝 Submission Guidelines

1. **For Developers (Frontend/Backend):**
   - Write clean, commented code
   - Follow existing code style
   - Test your solution
   - Document any assumptions

2. **For UI/UX Designer:**
   - Provide before/after screenshots or descriptions
   - Explain design decisions
   - Show responsive breakpoints

3. **For DevOps:**
   - Provide working scripts
   - Include documentation
   - Test the scripts

4. **For QA:**
   - Use provided templates
   - Be thorough and detailed
   - Think like an end-user

## ⏱️ Time Management Tips

- **Minutes 0-5:** Read all problems, choose your role
- **Minutes 5-20:** Work on Problem 1
- **Minutes 20-30:** Work on Problem 2
- **If time permits:** Review and refine your solutions

## ✅ Evaluation Criteria

- **Problem-solving approach**
- **Code quality / Documentation quality**
- **Understanding of requirements**
- **Attention to detail**
- **Time management**

Good luck! 🚀

