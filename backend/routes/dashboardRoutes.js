const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getDashboardData, setBudgetLimit } = require('../controllers/dashboardController');

const router = express.Router();

// Get Dashboard Data
router.get('/', protect, getDashboardData);

// Set Budget Limit (New Route)
router.put('/set-budget', protect, setBudgetLimit);
 // This is your new route to update budget limit

module.exports = router;
