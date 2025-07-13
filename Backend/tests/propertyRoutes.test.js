
const request = require('supertest');
const express = require('express');
const propertyRoutes = require('../routes/propertyRoutes');



jest.mock('../config/db', () => ({
  property: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
   
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


    test('POST /api/properties creates a property', async () => {
    const newProperty = {
      address: '456 Ave',
      price: 150000,
      bedrooms: 2,
      bathrooms: 1.5,
      description: 'Nice house',
      imageUrl: 'url'
    };

    const createdProperty = { id: 2, ...newProperty, ownerId: 1 };
    prisma.property.create.mockResolvedValue(createdProperty);

    const res = await request(app)
      .post('/api/properties')
      .send(newProperty);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(createdProperty);
  });


   test('PUT /api/properties/:id updates a property', async () => {
    const updated = { id: 1, address: 'Updated', price: 123456, ownerId: 1 };
    prisma.property.findUnique.mockResolvedValue(updated);
    prisma.property.update.mockResolvedValue(updated);

    const res = await request(app)
      .put('/api/properties/1')
      .send({ address: 'Updated', price: 123456 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(updated);
  });




  

});
