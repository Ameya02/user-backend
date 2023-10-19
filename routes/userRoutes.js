const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateAuth, deleteAuth, changePassword } = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');

// Route for users
router.post('/signup', registerUser);
router.post('/login', loginUser);
router.route('/update').put(protect, updateAuth)
router.delete('/delete', protect, deleteAuth)

router.post('/changepassword', changePassword);
router.post('/changepassword/:token', changePassword);

// Route for admin

module.exports = router;
