import React from "react";
import { useNavigate } from "react-router-dom";
import "./BecomeSeller.scss";

const BecomeSeller = () => {
  const navigate = useNavigate();

  const handleStartSelling = () => {
    navigate("/add"); // ✅ Redirect to Add Gig page
  };

  return (
    <div className="become-seller">
      <div className="container">
        <h1>Become a Seller on Gigly</h1>
        <p>
          Start your freelance journey and showcase your skills to clients worldwide.  
          Create your first gig and start earning today!
        </p>
        <button className="start-btn" onClick={handleStartSelling}>
          Create Your First Gig
        </button>
      </div>
    </div>
  );
};

export default BecomeSeller;
