const express = require('express');
const {
    createAppointment,
    getAllAppointments,
    getMyCustomerAppointments,
  
} = require('../controllers/appointmentController');


const router = express.Router();


router.post('/', createAppointment);

router.get('/', getAllAppointments);

 router.get('/my-customer-appointments',getMyCustomerAppointments);



module.exports = router;
