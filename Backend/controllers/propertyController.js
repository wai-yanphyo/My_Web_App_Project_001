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
    const { address, price, bedrooms, bathrooms, description, imageUrl} = req.body || {};
    const ownerId = req.user.id;
    console.log('Received request ownerId:', req.user); 

    if (!address || !price || !bedrooms || !bathrooms) {
        return res.status(400).json({ message: 'Please provide address, price, bedrooms, and bathrooms.' });
    }

    try {
        const newProperty = await prisma.property.create({
            data: {
                address:address,
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


const updateProperty = async (req, res) => {
    const { address, price, bedrooms, bathrooms, description, imageUrl } = req.body;
    const propertyId = parseInt(req.params.id);
    const userId = req.user.id;  //to change later

    if (isNaN(propertyId)) {
        return res.status(400).json({ message: 'Invalid property ID format.' });
    }

    try {
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
        });

        if (!property) {
            return res.status(404).json({ message: 'Property not found.' });
        }

        if (property.ownerId !== userId) {
            return res.status(403).json({ message: 'Not authorized to update this property. You are not the owner.' });
        }

        const updatedProperty = await prisma.property.update({
            where: { id: propertyId },
            data: {
                address: address !== undefined ? address : property.address,
                price: price !== undefined ? parseFloat(price) : property.price,
                bedrooms: bedrooms !== undefined ? parseInt(bedrooms) : property.bedrooms,
                bathrooms: bathrooms !== undefined ? parseFloat(bathrooms) : property.bathrooms,
                description: description !== undefined ? description : property.description,
                imageUrl: imageUrl !== undefined ? imageUrl : property.imageUrl,
            },
        });
        res.status(200).json(updatedProperty);
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ message: 'Server error while updating property.' });
    }
};


const deleteProperty = async (req, res) => {
    const propertyId = parseInt(req.params.id);
    const userId = req.user.id;
    if (isNaN(propertyId)) {
        return res.status(400).json({ message: 'Invalid property ID format.' });
    }
    try {
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
        });

        if (!property) {
            return res.status(404).json({ message: 'Property not found.' });
        }

        if (property.ownerId !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this property. You are not the owner.' });
        }

        await prisma.property.delete({
            where: { id: propertyId },
        });
        res.status(200).json({ message: 'Property successfully deleted.' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ message: 'Server error while deleting property.' });
    }
};


module.exports = {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty
    
    
};
