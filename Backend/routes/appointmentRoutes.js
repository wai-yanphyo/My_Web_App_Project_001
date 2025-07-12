const express = require('express');
const {
    createAppointment,
    getAllAppointments,
    getMyCustomerAppointments,
    getMyAgentAppointments,
    confirmAppointment,
    updateAppointmentStatus,
  
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');


const router = express.Router();


router.post('/',protect, createAppointment);

router.get('/', getAllAppointments);


 router.get('/my-customer-appointments',protect,getMyCustomerAppointments);

router.get('/my-agent-appointments',protect,getMyAgentAppointments);


router.put('/:id/confirm', confirmAppointment);


 router.put('/:id/status', updateAppointmentStatus);



 





module.exports = router;
