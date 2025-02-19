import React from "react";
import "./SignCard.css";

const SignCard = ({ image, text }) => {
  return (
    <div className="sign-card">
      <div className="inner">
        <div className="front">
          <img src={image} alt="Traffic Sign" className="sign-image" />
        </div>
        <div className="back">
          <h4>{text}</h4>
        </div>
      </div>
    </div>
  );
};

export default SignCard;
