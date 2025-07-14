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