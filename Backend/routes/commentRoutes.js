const express = require('express');

const { createComment, getCommentsForProperty } = require('../controllers/commentController');

const {protect} = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/authorize');



const router = express.Router();


router.post('/',protect, authorize(['CUSTOMER']),createComment);
router.get('/property/:propertyId', getCommentsForProperty);




module.exports = router;
