const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");
const authMiddleware = require("../middlewares/authMiddleware");
const mongoose = require('mongoose');

router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      message: "Users Fetched Successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error fetching users",
      success: false,
      error: error.message,
    });
  }
});

router.get("/get-all-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).send({
      message: "Doctors Fetched Successfully",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error fetching doctors",
      success: false,
      error: error.message,
    });
  }
});
router.post("/change-doctor-account-status", authMiddleware, async (req, res) => {
  try {
    const { doctorId, status, userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({
        message: "Invalid User ID",
        success: false,
      });
    }

    // Validate doctorId
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).send({
        message: "Invalid Doctor ID",
        success: false,
      });
    }
    const doctor = await Doctor.findByIdAndUpdate(doctorId, {
      status}, { new: true });
      // if (!doctor) {
      //   return res.status(404).send({
      //     message: "Doctor not found",
      //     success: false,
      //   });
    const user = await User.findById(doctor.userId);
    let unseenNotifications = user.unseenNotifications || [];
    unseenNotifications.push({
      type: "new-doctor-request-changed",
      message: `Your Doctor Account has been ${status}`,
      onClickPath: "/notifications",
    });
    user.isDoctor = status ==="approved" ? true : false;

    await User.findByIdAndUpdate(User._id, { unseenNotifications });
    await user.save();
    const doctors = await Doctor.find({});

    res.status(200).send({
      message: "Doctor Status Updated Successfully",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error Applying doctor account status",
      success: false,
      error: error.message,
    });
  }
});



module.exports = router;
