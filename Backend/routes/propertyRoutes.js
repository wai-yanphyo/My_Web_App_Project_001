const express = require('express');



const {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,

} = require('../controllers/propertyController');


const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

router.route('/')
    .get(getProperties)     // Public
    .post(protect,createProperty)

router.route('/:id')
    .get(getPropertyById) 
    .put(protect,updateProperty)
    .delete(deleteProperty); 






module.exports = router;

