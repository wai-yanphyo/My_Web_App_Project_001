const prisma = require('../config/db'); // Import Prisma client


const getProperties = async (req, res) => {
    try {
        const properties = await prisma.property.findMany();
        res.status(200).json(properties);
        // setTimeout(()=>{
        //             res.status(200).json(properties);

        // },200);


    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ message: 'Server error while fetching properties.' });
    }
};


const getPropertyById = async (req, res) => {
    const propertyId = parseInt(req.params.id);

    // Basic validation for ID
    if (isNaN(propertyId)) {
        return res.status(400).json({ message: 'Invalid property ID format.' });
    }

    try {
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
        });

        if (!property) {
            console.log("Hello",req.params.id);
            return res.status(404).json({ message: 'Property not found.' });
        }
        res.status(200).json(property);
    } catch (error) {
        console.error('Error fetching property by ID:', error);
        res.status(500).json({ message: 'Server error while fetching property.' });
    }
};









module.exports = {
    getProperties,
    getPropertyById,

    
    
};
