const prisma = require('../config/db');


const createComment = async (req, res) => {
    const { propertyId, rating, comment } = req.body || {};

    const customerId = 1 // I will change that after tsing -Get customer ID from authenticated user

 
    if (!propertyId || !rating) {
        return res.status(400).json({ message: 'Property ID and rating are required.' });
    }
    if (isNaN(parseInt(propertyId))) {
        return res.status(400).json({ message: 'Invalid property ID format.' });
    }
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5 stars.' });
    }

    try {
        const propertyExists = await prisma.property.findUnique({
            where: { id: parseInt(propertyId) }
        });
        if (!propertyExists) {
            return res.status(404).json({ message: 'Property not found.' });
        }

        const newComment = await prisma.commentAndRating.create({
            data: {
                propertyId: parseInt(propertyId),
                customerId: customerId,
                rating: parseInt(rating),
                comment: comment || null,
            },
            include: {
                customer: { select: { email: true } } 
            }
        });
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Server error while creating comment.' });
    }
};


const getCommentsForProperty = async (req, res) => {
    const propertyId = parseInt(req.params.propertyId);

    if (isNaN(propertyId)) {
        return res.status(400).json({ message: 'Invalid property ID format.' });
    }

    try {
        const comments = await prisma.commentAndRating.findMany({
            where: { propertyId: propertyId },
            include: {
                customer: { select: { email: true, id: true } } 
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments for property:', error);
        res.status(500).json({ message: 'Server error while fetching comments.' });
    }
};

module.exports = {
    createComment,
    getCommentsForProperty,

};

