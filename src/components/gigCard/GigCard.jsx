import React from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";

const GigCard = ({ item }) => {
  // ✅ Use populated user data directly (no extra fetch)
  const coverImage = item.cover
    ? item.cover
    : "https://via.placeholder.com/400x300?text=No+Image";

  const userImage = item.userId?.img
    ? item.userId.img
    : "/img/noavatar.jpg";

  const username = item.userId?.username || "Unknown User";

  return (
    <Link to={`/gig/${item._id}`} className="link">
      <div className="gigCard">
        {/* ✅ Display Cover Image */}
        <img
          src={coverImage}
          alt="Gig Cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
          }}
        />

        <div className="info">
          <div className="user">
            <img
              src={userImage}
              alt="User Profile"
              onError={(e) => {
                e.target.src = "/img/noavatar.jpg";
              }}
            />
            <span>{username}</span>
          </div>

          <p>{item.desc || "No description available."}</p>

          <div className="star">
            <img src="./img/star.png" alt="star" />
            <span>
              {!isNaN(item.totalStars / item.starNumber) &&
                Math.round(item.totalStars / item.starNumber)}
            </span>
          </div>
        </div>
        <hr />
        <div className="detail">
          <img src="./img/heart.png" alt="heart" />
          <div className="price">
            <span>STARTING AT</span>
            <h2>$ {item.price || 0}</h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
