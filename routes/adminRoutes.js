const express = require('express');
const { Adminaccess } = require('../middleware/adminMiddleware');
const { getAllUsers, adminDeleteAuth, adminUpdateAccess } = require('../controllers/adminControllers');
const router = express.Router();

router.route('/getallusers').get(Adminaccess, getAllUsers);
router.route('/updateAccess/:id').put(Adminaccess, adminUpdateAccess);
router.route('/delete/:id').delete(Adminaccess, adminDeleteAuth);



module.exports = router;