const express = require('express');

const { createComment, getCommentsForProperty } = require('../controllers/commentController');

const {protect} = require('../middleware/authMiddleware');



const router = express.Router();


router.post('/',protect,createComment);
router.get('/property/:propertyId', getCommentsForProperty);




module.exports = router;
