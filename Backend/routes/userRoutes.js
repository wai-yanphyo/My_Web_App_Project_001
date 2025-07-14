const express = require('express');


const { getAllUsers, updateUserRole, } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/authorize');


const router = express.Router();




router.get('/',protect, authorize(['ADMIN']),getAllUsers);
router.put('/:id/role',protect, authorize(['ADMIN']),updateUserRole);


module.exports = router;
