import express from 'express';
import { updateDoctor, deleteDoctor, getSingleDoctor, getAllDoctors, getDoctorProfile, getTopDoctors } from "../Controllers/doctorController.js";
import { authenticate, restrict } from '../Auth/verifyToken.js';
import reviewRouter from './review.js'
import bookingRouter from './booking.js'
import { getDoctorBookings } from '../Controllers/bookingController.js';

const router = express.Router()

// ── Specific static routes FIRST (before /:id catches them) ──
router.get('/topdoctors',  getTopDoctors)
router.get('/my-bookings', authenticate, restrict(['doctor']), getDoctorBookings)
router.get('/profile/me',  authenticate, restrict(['doctor']), getDoctorProfile)
router.get('/',            getAllDoctors)

// ── Parameterised routes ──
router.use('/:doctorId/reviews',  reviewRouter)
router.use('/:doctorId/booking',  bookingRouter)
router.get('/:id',                getSingleDoctor)
router.put('/:id',                authenticate, restrict(['doctor']), updateDoctor)
router.delete('/:id',             authenticate, restrict(['doctor']), deleteDoctor)

export default router;