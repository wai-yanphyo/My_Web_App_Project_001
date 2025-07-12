const {PrismaClient,Role,AppointmentStatus} = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;