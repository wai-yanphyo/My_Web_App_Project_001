
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









module.exports = {
    getProperties,
    
    
};
