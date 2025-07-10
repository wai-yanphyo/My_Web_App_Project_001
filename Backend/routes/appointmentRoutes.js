const express = require('express');
const {
    createAppointment,
    getAllAppointments,
    getMyCustomerAppointments,
    getMyAgentAppointments,
  
} = require('../controllers/appointmentController');


const router = express.Router();


router.post('/', createAppointment);

router.get('/', getAllAppointments);


 router.get('/my-customer-appointments',getMyCustomerAppointments);

router.get('/my-agent-appointments',getMyAgentAppointments);

 





module.exports = router;
