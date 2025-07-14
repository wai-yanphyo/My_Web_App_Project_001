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
const { authorize } = require('../middleware/authorize');


const router = express.Router();


router.post('/',protect,authorize(['CUSTOMER']), createAppointment);

router.get('/', protect,authorize(['ADMIN']), getAllAppointments);


 router.get('/my-customer-appointments',protect,authorize(['CUSTOMER']),getMyCustomerAppointments);

router.get('/my-agent-appointments',protect,authorize(['AGENT']),getMyAgentAppointments);


router.put('/:id/confirm',protect, authorize(['ADMIN']),  confirmAppointment);


 router.put('/:id/status', protect,  authorize(['ADMIN', 'AGENT', 'CUSTOMER']), updateAppointmentStatus);



 





module.exports = router;
