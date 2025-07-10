const {PrismaClient,Role} = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;