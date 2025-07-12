const express = require('express');



const {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,

} = require('../controllers/propertyController');


const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getProperties)     // Public
    .post(protect,createProperty)

router.route('/:id')
    .get(getPropertyById) 
    .put(protect,updateProperty)
    .delete(protect,deleteProperty); 






module.exports = router;

