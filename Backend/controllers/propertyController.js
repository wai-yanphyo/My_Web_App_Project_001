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

const createProperty = async (req, res) => {
     console.log('Received request body:', req.body); 
    const { address, price, bedrooms, bathrooms, description, imageUrl,} = req.body || {};
    const ownerId = 1;
    console.log('Received request ownerId:', req.user); 

    if (!address || !price || !bedrooms || !bathrooms) {
        return res.status(400).json({ message: 'Please provide address, price, bedrooms, and bathrooms.' });
    }

    try {
        const newProperty = await prisma.property.create({
            data: {
                address,
                price: parseFloat(price),
                bedrooms: parseInt(bedrooms),
                bathrooms: parseFloat(bathrooms),
                description: description,
                imageUrl: imageUrl,                      
                ownerId: ownerId,
            },
        });
        res.status(201).json(newProperty);
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ message: 'Server error while creating property.' });
    }
};









module.exports = {
    getProperties,
    getPropertyById,
    createProperty

    
    
};
