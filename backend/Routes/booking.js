import express from "express";
import { changeStatus, scheduleBooking } from "../Controllers/bookingController.js";
import { authenticate, restrict } from "../Auth/verifyToken.js";
import { getMyAppointments } from "../Controllers/userController.js";

const router = express.Router({mergeParams:true})
router.post('/',authenticate,restrict(['patient']),scheduleBooking)
router.put('/:bookingId',authenticate, restrict(["doctor"]), changeStatus)
export default router