const express = require('express');
const {
    createAppointment,
    getAllAppointments,
    getMyCustomerAppointments,
    getMyAgentAppointments,
    confirmAppointment,
    updateAppointmentStatus,
  
} = require('../controllers/appointmentController');
//const { protect } = require('../middleware/authMiddleware');


const router = express.Router();


router.post('/', createAppointment);

router.get('/', getAllAppointments);


 router.get('/my-customer-appointments',getMyCustomerAppointments);

router.get('/my-agent-appointments',getMyAgentAppointments);


router.put('/:id/confirm', confirmAppointment);


 router.put('/:id/status', updateAppointmentStatus);



 





module.exports = router;
