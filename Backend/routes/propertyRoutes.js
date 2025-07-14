const express = require('express');
const {authorize}= require('../middleware/authorize');



const {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    getMyProperties,

} = require('../controllers/propertyController');


const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getProperties)     // Public
    .post(protect,authorize(['AGENT', 'ADMIN']),createProperty)

router.route('/:id')
    .get(getPropertyById) 
    .put(protect, authorize(['AGENT', 'ADMIN']), updateProperty)
    .delete(protect,authorize(['ADMIN']),deleteProperty); 

router.get('/my-properties', protect, authorize(['AGENT', 'ADMIN']), getMyProperties);






module.exports = router;

