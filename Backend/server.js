const express = require('express');
const cors = require('cors'); // Import cors middleware
const prisma = require('./config/db'); // Import Prisma client
const propertyRoutes = require('./routes/propertyRoutes');

const app = express();
const PORT = process.env.PORT || 5000;





// Define API routes
app.use('/api/properties', propertyRoutes); // Property routes (e.g., /api/properties)



//to start the server
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    // Connect to database on server start (Prisma handles connection pooling)
    try {
        await prisma.$connect();
        console.log('Connected to database');
    } catch (error) {
        console.error('Database connection error:', error);
        // Exit process if database connection fails
        process.exit(1);
    }
});

//shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    console.log('Disconnected from database');
    process.exit(0);
});
