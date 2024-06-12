import React from "react";
import { useNavigate } from "react-router-dom";

function Doctor({ doctor }) {
    const navigate=useNavigate();
  return (
    <div className="card profile-card m-1 cursor-pointer " onClick={()=>navigate(`/book-appointsment/${doctor._id}`)}>
      <h1 className="card-title  ri-user-line ">
        {" "}
        Dr. {doctor.firstName} {doctor.lastName}
      </h1>
      <hr />
      <div className="m-3">
        <p className="card-text">
          {" "}
          <b> Phone Number: </b>
          {doctor.phoneNumber}
        </p>
        <p className="card-text">
          <b>Address: </b>
          {doctor.address}
        </p>
        <p className="card-text">
          <b>Fee Per Consultation: </b>
          {doctor.feePerConsultation}
        </p>
        <p className="card-text">
          <b>Timings: </b>
          {doctor.timings[0]}-{doctor.timings[1]}
        </p>
      </div>
    </div>
  );
}

export default Doctor;
