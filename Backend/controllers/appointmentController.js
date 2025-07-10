
const prisma = require('../config/db');

const { AppointmentStatus } = require('@prisma/client');



const createAppointment = async (req, res) => {
    const { propertyId, appointmentDate } = req.body;
    const customerId  = 1;
   
    if (!propertyId || !appointmentDate) {
        return res.status(400).json({ message: 'Please provide property ID and appointment date.' });
    }


    const parsedDate = new Date(appointmentDate);
    if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: 'Invalid appointment date format.' });
    }
    if (parsedDate < new Date()) {
        return res.status(400).json({ message: 'Appointment date cannot be in the past.' });
    }

    try {
        
        const property = await prisma.property.findUnique({
            where: { id: parseInt(propertyId) }
        });
        if (!property) {
            return res.status(404).json({ message: 'Property not found for this appointment.' });
        }

        const newAppointment = await prisma.appointment.create({
            data: {
                propertyId: parseInt(propertyId),
                customerId: customerId,
                appointmentDate: parsedDate,
                status: 'PENDING', 
            },
            include: {
                property: { select: { address: true, imageUrl: true } },
                customer: { select: { email: true } }
            }
        });
        res.status(201).json(newAppointment);
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: 'Server error while creating appointment.' });
    }
};


const getAllAppointments = async (req, res) => {
    try {
        const appointments = await prisma.appointment.findMany({
            include: {
                property: { select: { address: true, imageUrl: true, ownerId: true } },
                customer: { select: { email: true } },
                agent: { select: { email: true } } 
            },
            
            orderBy: [{ appointmentDate: 'asc' }, { status: 'asc' }]
        });
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching all appointments:', error);
        res.status(500).json({ message: 'Server error while fetching appointments.' });
    }
};


const getMyCustomerAppointments = async (req, res) => {
     const customerId = 1;
    
    try {
        const appointments = await prisma.appointment.findMany({
            where: { customerId: customerId },
            include: {
                property: { select: { address: true, imageUrl: true } },
                agent: { select: { email: true } }
            },
            orderBy: [{ appointmentDate: 'asc' }]
        });
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching customer appointments:', error);
        res.status(500).json({ message: 'Server error while fetching your appointments.' });
    }
};



const getMyAgentAppointments = async (req, res) => {
    const agentId = 1;
   
    try {
        const appointments = await prisma.appointment.findMany({
            where: { agentId: agentId },
            include: {
                property: { select: { address: true, imageUrl: true } },
                customer: { select: { email: true } }
            },
            orderBy: [{ appointmentDate: 'asc' }]
        });
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching agent appointments:', error);
        res.status(500).json({ message: 'Server error while fetching assigned appointments.' });
    }
};





module.exports = {
    createAppointment,
    getAllAppointments,
    getMyCustomerAppointments,
    getMyAgentAppointments,
   
};