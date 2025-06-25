// backend/routes/propertyRoutes.js
const express = require('express');



const {
    getProperties,
    getPropertyById,
} = require('../controllers/propertyController');


const router = express.Router();

router.route('/')
    .get(getProperties)     // Public



module.exports = router;

