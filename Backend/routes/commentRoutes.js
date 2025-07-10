const express = require('express');

const { createComment, getCommentsForProperty } = require('../controllers/commentController');



const router = express.Router();


router.post('/',createComment);
router.get('/property/:propertyId', getCommentsForProperty);




module.exports = router;
