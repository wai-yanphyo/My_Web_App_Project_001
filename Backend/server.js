const express = require('express');
const cors = require('cors'); 
const prisma = require('./config/db'); 
const propertyRoutes = require('./routes/propertyRoutes');
const userRoutes = require('./routes/userRoutes');
const commentRoutes=require('./routes/commentRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');



const app = express();
const PORT = process.env.PORT || 5000;





app.use(express.urlencoded({ extended: true }));
app.use('/api/properties', propertyRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/appointments', appointmentRoutes);





app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
 
    try {
        await prisma.$connect();
        console.log('Connected to database');
    } catch (error) {
        console.error('Database connection error:', error);
        
        process.exit(1);
    }
});


process.on('SIGINT', async () => {
    await prisma.$disconnect();
    console.log('Disconnected from database');
    process.exit(0);
});
