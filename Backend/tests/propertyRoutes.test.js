
const request = require('supertest');
const express = require('express');
const propertyRoutes = require('../routes/propertyRoutes');



jest.mock('../config/db', () => ({
  property: {
    findMany: jest.fn(),
   
  }
}));



jest.mock('../middleware/authMiddleware', () => ({
  protect: (req, res, next) => {
    req.user = { id: 1, role: 'AGENT' }; 
    next();
  }
}));



const prisma = require('../config/db');

const app = express();
app.use(express.json());
app.use('/api/properties', propertyRoutes);

describe('Property API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/properties returns a list of properties', async () => {
    const fakeProperties = [
      { id: 1, address: '123 Street', price: 100000, bedrooms: 3, bathrooms: 2 },
    ];
    prisma.property.findMany.mockResolvedValue(fakeProperties);

    const res = await request(app).get('/api/properties');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(fakeProperties);
  });

  

});
