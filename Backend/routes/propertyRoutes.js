const express = require('express');



const {
    getProperties,
    getPropertyById,
} = require('../controllers/propertyController');


const router = express.Router();

router.route('/')
    .get(getProperties)     // Public

router.route('/:id')
    .get(getPropertyById)         // Public can use


module.exports = router;

