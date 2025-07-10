const express = require('express');


const { getAllUsers, updateUserRole, } = require('../controllers/userController');


const router = express.Router();




router.get('/',getAllUsers);
router.put('/:id/role',updateUserRole);


module.exports = router;
