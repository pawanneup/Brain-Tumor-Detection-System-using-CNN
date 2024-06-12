const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Appointment = require('../models/appointmentModel');

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
// const Appointment = require("../models/appointmentModel");
const moment = require("moment"); 
// const { default: Appointments } = require("../client/src/Pages/Appointment");
// const { upload } = require('../config/uploadConfig');
// const cloudinary = require('cloudinary').v2;

router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "user already exists", success: false });
    }

    const password = req.body.password;

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    req.body.password = hashedPassword;

    const newuser = new User(req.body);

    await newuser.save();

    res
      .status(200)
      .send({ message: "user created sucessfully", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "error creating user", success: false, error });
  }
});
router.post("/login", async (req, res) => {
  try {
    const {  password } = req.body;
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user does not exist", success: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "password is incorrect", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res
        .status(200)
        .send({ message: "login successful", success: true, data: token });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "error logging in", success: false, error });
  }
});
router.post("/get-user-info-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ message: "user does not exist", success: false });
    } else {
      return res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "error getting user info", success: false, error });
  }
});

router.post("/applydoctor", authMiddleware, async (req, res) => {
  try {
    const newDoctor = new Doctor({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await User.findOne({ isAdmin: true });
    // if (!adminUser) {
    //   return res.status(404).send({ message: "Admin user not found", success: false });
    // }
    if (!adminUser) {
      return res
        .status(404)
        .send({ message: "Admin user not found", success: false });
    }
    let unseenNotifications = adminUser.unseenNotifications || [];
    unseenNotifications.push({
      type: "new-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data: {
        doctorid: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
      },
      onClickPath: "/admin/doctors",
    });
    await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });
    res.status(200).send({
      success: true,
      message: "Doctor account applied successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});
router.post(
  "/mark-all-notifications-as-seen",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body.userId });
      if (!user) {
        return res
          .status(404)
          .send({ message: "User not found", success: false });
      }
      const unseenNotifications = user.unseenNotifications;
      const seenNotifications = user.seenNotifications;
      seenNotifications.push(...unseenNotifications);
      user.seenNotifications = unseenNotifications;
      user.unseenNotifications = [];
      //  user.seenNotifications=seenNotifications;
      const updatedUser = await user.save();
      updatedUser.password = undefined;
      res.status(200).send({
        success: true,
        message: "All Notifications Marked As Seen",
        data: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error Marking Notifications As seen",
        success: false,
        error,
      });
    }
  }
);
router.post("/delete-all-notifications", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }

    user.seenNotifications = [];
    user.unseenNotifications = [];

    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.status(200).send({
      success: true,
      message: "All Notifications Deleted",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error deleting notifications", success: false, error });
  }
});
router.get("/get-all-approved-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" });
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


// router.post('/upload', upload.single('profileImage'), authMiddleware, async (req, res) => {
//   try {
//     const file = req.file;
//     if (!file) {
//       return res.status(400).send('No file uploaded.');
//     }

//     // Upload to Cloudinary
//     const result = await cloudinary.uploader.upload(file.path);
//     const imageUrl = result.secure_url;

//     // Update doctor's profile with the image URL
//     const doctorId = req.body.doctorId;
//     const doctor = await Doctor.findById(doctorId);
//     if (!doctor) {
//       return res.status(404).send('Doctor not found.');
//     }
//     doctor.profileImage = imageUrl;
//     await doctor.save();

//     res.send({ success: true, imageUrl });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

router.post("/check-booking-availability", authMiddleware, async (req, res) => {
  try {
    const date=moment(req.body.date, 'DD-MM-YYYY').toISOString();
    const fromTime = moment(req.body.time, 'HH-mm').subtract(1, 'hours').toISOString();
    const toTime = moment(req.body.time, 'HH-mm').add(1, 'hours').toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await Appointment.find({
      doctorId,
      date,
      // date:{$gte:date, $lte : date},
      time:{$gte: fromTime,$lte:toTime},
      // status:"approved",
    });
    if(appointments.length>0){
      return res.status(200).send({
        message:"Appointment not available",
        success: false,
      });
    
    }
    else{
      return res.status(200).send({
        message: " Appointments Available",
        success: true,
      })
    }
    // res.status(200).send({
    //   message: "Appointment Booked Successfully ",
    //   success: true,
    // });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error checking Appointment Availability",
      success: false,
      error:error.message,
    });
  }
});

router.post("/book-appointment", authMiddleware, async (req, res) => {
  try {
    req.body.status = "pending";
    req.body.date =moment(req.body.date, 'DD-MM-YYYY').toISOString()
    req.body.time =moment(req.body.time, 'HH:mm').toISOString()
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    const user = await User.findOne({ _id: req.body.doctorInfo.userId });
 
    if (!user) {
      return res.status(404).send({
        message: "Doctor not found",
        success: false,
      });
    }
    user.unseenNotifications.push({
      type: "new-appointment-request",
      message: `A new appointment request has been made by ${req.body.userInfo.name}`,
      onClickPath: "/doctor/appointments",
    });
    await user.save();
    res.status(200).send({
      message: "Appointment Booked Successfully ",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error Booking Appointment",
      success: false,
      error: error.message,
    });
  }
});
router.get("/get-appointments-by-user-id", authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.find({userId: req.body.userId});
    res.status(200).send({
      message: "Appointments  Fetched Successfully",
      success: true,
      data: appointment,
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


router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId).select("-password"); // Exclude password from the response
    if (!user) {
      return res.status(404).send({ message: "User not found", success: false });
    }
    res.status(200).send({ message: "User profile fetched successfully", success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error", success: false, error });
  }
});

// router.get('/profile', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.body.userId).select('-password');
//     if (!user) {
//       return res.status(404).send({ message: 'User not found', success: false });
//     }
//     res.status(200).send({ message: 'User profile fetched successfully', success: true, data: user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Server error', success: false, error });
//   }
// });

module.exports= router;
