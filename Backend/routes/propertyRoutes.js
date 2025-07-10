const express = require('express');



const {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,

} = require('../controllers/propertyController');


const router = express.Router();

router.route('/')
    .get(getProperties)     // Public
    .post(createProperty)

router.route('/:id')
    .get(getPropertyById) 
    .put( updateProperty)
    .delete(deleteProperty); 






module.exports = router;

