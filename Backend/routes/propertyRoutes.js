const express = require('express');



const {
    getProperties,
    getPropertyById,
    createProperty,
} = require('../controllers/propertyController');


const router = express.Router();

router.route('/')
    .get(getProperties)     // Public
    .post(createProperty)

router.route('/:id')
    .get(getPropertyById)        // Public can use

module.exports = router;

