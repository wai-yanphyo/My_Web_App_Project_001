const request = require('supertest');
const express = require('express');
const appointmentRoutes = require('../routes/appointmentRoutes');

jest.mock('../config/db', () => ({
  appointment: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  property: {
    findUnique: jest.fn()
  },
  user: {
    findUnique: jest.fn()
  },
  AppointmentStatus: {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    CANCELLED: 'CANCELLED',
    COMPLETED: 'COMPLETED',
  }
}));

jest.mock('../middleware/authMiddleware', () => ({
  protect: (req, res, next) => {
    req.user = { id: 3, role: 'ADMIN' }; 
    next();
  }
}));

jest.mock('../middleware/authorize', () => ({
  authorize: () => (req, res, next) => next()
}));



const prisma = require('../config/db');

const app = express();
app.use(express.json());
app.use('/api/appointments', appointmentRoutes);

describe('Appointment API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/appointments returns all appointments', async () => {
    const fakeAppointments = [
      {
        id: 1,
        appointmentDate: '2099-01-01T10:00:00Z',
        status: 'PENDING',
        property: { address: '123 St', imageUrl: 'url', ownerId: 1 },
        customer: { email: 'customer@example.com' },
        agent: { email: 'agent@example.com' }
      }
    ];

    prisma.appointment.findMany.mockResolvedValue(fakeAppointments);

    const res = await request(app).get('/api/appointments');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(fakeAppointments);
  });

  test('POST /api/appointments creates an appointment', async () => {
    const appointmentData = {
      propertyId: 1,
      appointmentDate: '2099-01-01T10:00:00Z'
    };

    prisma.property.findUnique.mockResolvedValue({ id: 1 });
    prisma.appointment.create.mockResolvedValue({
      id: 1,
      ...appointmentData,
      customerId: 1,
      status: 'PENDING',
      property: { address: '123 St', imageUrl: 'url' },
      customer: { email: 'test@example.com' }
    });

    const res = await request(app)
      .post('/api/appointments')
      .send(appointmentData);

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('PENDING');
  });

   test('PUT /api/appointments/:id/confirm confirms appointment', async () => {
    prisma.appointment.findUnique.mockResolvedValue({ id: 1, agentId: null });
    prisma.user.findUnique.mockResolvedValue({ id: 2, role: 'AGENT' });

    prisma.appointment.update.mockResolvedValue({
      id: 1,
      status: 'CONFIRMED',
      agentId: 2,
      property: { address: 'Test' },
      customer: { email: 'customer@example.com' },
      agent: { email: 'agent@example.com' }
    });

    const res = await request(app)
      .put('/api/appointments/1/confirm')
      .send({ agentId: 2 });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('CONFIRMED');
  });

  
  test('PUT /api/appointments/:id/status updates appointment status', async () => {
    prisma.appointment.findUnique.mockResolvedValue({ id: 1, customerId: 3, agentId: 2 });

    prisma.appointment.update.mockResolvedValue({
      id: 1,
      status: 'CANCELLED',
      property: { address: 'Test' },
      customer: { email: 'customer@example.com' },
      agent: { email: 'agent@example.com' }
    });

    const res = await request(app)
      .put('/api/appointments/1/status')
      .send({ status: 'CANCELLED' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('CANCELLED');
  });


  test('GET /api/appointments/my-customer-appointments returns customer appointments', async () => {
    const mockAppointments = [
      { id: 1, property: { address: '123' }, agent: { email: 'agent@example.com' } }
    ];
    prisma.appointment.findMany.mockResolvedValue(mockAppointments);

    const res = await request(app).get('/api/appointments/my-customer-appointments');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockAppointments);
  });

  test('GET /api/appointments/my-agent-appointments returns agent appointments', async () => {
    const mockAppointments = [
      { id: 2, property: { address: '456' }, customer: { email: 'customer@example.com' } }
    ];
    prisma.appointment.findMany.mockResolvedValue(mockAppointments);

    const res = await request(app).get('/api/appointments/my-agent-appointments');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockAppointments);
  });

 
  
});
