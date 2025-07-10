const prisma = require('../config/db');

const { Role } = require('@prisma/client');


const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
            }
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Server error while fetching users.' });
    }
};



const updateUserRole = async (req, res) => {
    const userIdToUpdate = parseInt(req.params.id);
    const { role } = req.body;

     
    if (isNaN(userIdToUpdate) || !role || !Object.values(Role).includes(role)) {
        return res.status(400).json({ message: 'Invalid user ID or role provided.' });
    }
    
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userIdToUpdate },
            data: { role: role},
            select: { id: true, email: true, role: true } // Return updated user info
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Server error while updating user role.' });
    }
};

module.exports = {
    getAllUsers,
    updateUserRole,
};

