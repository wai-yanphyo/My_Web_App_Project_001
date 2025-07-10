
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


const confirmAppointment = async (req, res) => {
    const appointmentId = parseInt(req.params.id);
    const { agentId } = req.body; 

    if (isNaN(appointmentId)) {
        return res.status(400).json({ message: 'Invalid appointment ID format.' });
    }

    try {
        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId }
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        // Validate agentId if provided
        let assignedAgent = null;
        if (agentId) {
            assignedAgent = await prisma.user.findUnique({
                where: { id: parseInt(agentId) }
            });
            if (!assignedAgent || assignedAgent.role !== 'AGENT') {
                return res.status(400).json({ message: 'Provided agent ID is invalid or not an agent.' });
            }
        }

        const updatedAppointment = await prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                status: 'CONFIRMED',
                agentId: agentId ? parseInt(agentId) : appointment.agentId, // Assign new agent or keep existing
            },
            include: {
                property: { select: { address: true } },
                customer: { select: { email: true } },
                agent: { select: { email: true } }
            }
        });
        res.status(200).json(updatedAppointment);
    } catch (error) {
        console.error('Error confirming appointment:', error);
        res.status(500).json({ message: 'Server error while confirming appointment.' });
    }
};




const updateAppointmentStatus = async (req, res) => {
    const appointmentId = parseInt(req.params.id);
    console.log(appointmentId);
    const { status } = req.body;
    console.log(status);
     const userId =3;
    const userRole ='ADMIN';





    if (isNaN(appointmentId) || !status || !Object.values(AppointmentStatus).includes(status)) {
        return res.status(400).json({ message: 'Invalid appointment ID or status.' });
    }

    

     try {
        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId }
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        if (userRole === 'CUSTOMER') {
            if (appointment.customerId !== userId || status !== 'CANCELLED') {
                return res.status(403).json({ message: 'Not authorized to update this appointment status. a' });
            }
        } else if (userRole === 'AGENT') {
            if (appointment.agentId !== userId || status !== 'COMPLETED') {
                return res.status(403).json({ message: 'Not authorized to update this appointment status. b' });
            }
        } else if (userRole !== 'ADMIN') {

            return res.status(403).json({ message: 'Not authorized to update this appointment status. c' });
        }


        const updatedAppointment = await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: status },
            include: {
                property: { select: { address: true } },
                customer: { select: { email: true } },
                agent: { select: { email: true } }
            }
        });

        return res.status(200).json(updatedAppointment);

    } catch (error) {
        console.error('Error updating appointment status:', error);
        return res.status(500).json({ message: 'Server error while updating appointment status.' });
    }
};



module.exports = {
    createAppointment,
    getAllAppointments,
    getMyCustomerAppointments,
    getMyAgentAppointments,
    confirmAppointment,
    updateAppointmentStatus,
   
};