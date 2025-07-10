const express = require('express');
const {
    createAppointment,
    getAllAppointments,
    getMyCustomerAppointments,
    getMyAgentAppointments,
    confirmAppointment,
  
} = require('../controllers/appointmentController');


const router = express.Router();


router.post('/', createAppointment);

router.get('/', getAllAppointments);


 router.get('/my-customer-appointments',getMyCustomerAppointments);

router.get('/my-agent-appointments',getMyAgentAppointments);


router.put('/:id/confirm', confirmAppointment);


 





module.exports = router;
