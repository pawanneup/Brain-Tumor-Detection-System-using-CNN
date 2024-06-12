const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctorModel");
const Appointment = require('../models/appointmentModel'); 
const User = require("../models/userModel");
const authMiddleware = require("../middlewares/authMiddleware")

router.post("/get-doctor-info-by-user-id", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Doctor info fetched Successfully",
      data: doctor,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "error getting doctor info", success: false, error });
  }
});
router.post("/get-doctor-info-by-id", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Doctor info fetched Successfully",
      data: doctor,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "error getting doctor info", success: false, error });
  }
});
router.post("/update-doctor-profile", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate({userId: req.body.userId}, req.body);
    res.status(200).send({
      success: true,
      message: "Doctor profile updated Successfully",
      data: doctor,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "error getting doctor info", success: false, error });
  }
});
router.get("/get-appointments-by-doctor-id", authMiddleware, async (req, res) => {
  try {
    const user = req.query.userId;
    const doctor = await Doctor.findOne({userId:req.body.userId})
    const appointments = await Appointment.find({doctorId: doctor._id});
    res.status(200).send({
      message: "Appointments  Fetched Successfully",
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error fetching Appointments",
      success: false,
      error,
    });
  }
});
// router.post("/change-appointment-status", authMiddleware, async (req, res) => {
//   try {
//     const {appointmentId, status } = req.body;

//     const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
//       status} );
  
//     const user = await User.findOne({_id:  appointment.userId});
//     let unseenNotifications = user.unseenNotifications ;
//     unseenNotifications.push({
//       type: "appointment-status-changed",
//       message: `Your Appointment Status has been ${status}`,
//       onClickPath: "/appointments",
//     });
  
//     await user.save();
 

//     res.status(200).send({
//       message: "Appointment Status Updated Successfully",
//       success: true,
     
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({
//       message: "Error Changing appointment status",
//       success: false,
//       error: error.message,
//     });
//   }
// });
router.post("/change-appointment-status", authMiddleware, async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

   
    const appointment = await Appointment.findById(appointmentId);

     
    if (!appointment) {
      return res.status(404).send({
        message: "Appointment not found",
        success: false,
      });
    }

  
    const userId = appointment.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }

    appointment.status = status;
    await appointment.save();

    user.unseenNotifications.push({
      type: "appointment-status-changed",
      message: `Your Appointment Status has been ${status}`,
      onClickPath: "/appointments",
    });
    await user.save();

    res.status(200).send({
      message: "Appointment Status Updated Successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error Changing appointment status",
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
