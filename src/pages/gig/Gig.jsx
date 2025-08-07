import React from "react";
import "./Gig.scss";
import Slider from "react-slick";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";

function Gig() {
  const { id } = useParams();

  // ✅ Fetch gig data
  const {
    isLoading,
    error,
    data: gigData,
  } = useQuery({
    queryKey: ["gig", id],
    queryFn: () => newRequest.get(`/gigs/single/${id}`).then((res) => res.data),
    staleTime: 1000 * 60 * 5, // Cache gig data for 5 mins
  });

  const userId = gigData?.userId;

  // ✅ Fetch user data only after gig data is available
  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => newRequest.get(`/users/${userId}`).then((res) => res.data),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  // ✅ Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  if (isLoading) return <div className="gig">Loading...</div>;
  if (error) return <div className="gig">Something went wrong!</div>;

  return (
    <div className="gig">
      <div className="container">
        {/* ---------- Left Side ---------- */}
        <div className="left">
          <span className="breadcrumbs">
            Gigly {">"} {gigData.cat || "Category"} {">"}
          </span>
          <h1>{gigData.title}</h1>

          {/* ---------- Seller Info ---------- */}
          {isLoadingUser ? (
            "Loading seller..."
          ) : errorUser ? (
            "Seller info unavailable."
          ) : (
            <div className="user">
              <Link to={`/seller/${dataUser?._id}`} className="profile-link">
                <img
                  className="pp"
                  src={dataUser?.img || "/img/noavatar.jpg"}
                  alt="profile"
                />
              </Link>
              <Link to={`/seller/${dataUser?._id}`} className="profile-link">
                <span>{dataUser?.username}</span>
              </Link>
              {!isNaN(gigData.totalStars / gigData.starNumber) && (
                <div className="stars">
                  {Array(Math.round(gigData.totalStars / gigData.starNumber))
                    .fill()
                    .map((_, i) => (
                      <img src="/img/star.png" alt="star" key={i} />
                    ))}
                  <span>
                    {Math.round(gigData.totalStars / gigData.starNumber)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ---------- Images Carousel ---------- */}
          <Slider {...sliderSettings} className="slider">
            {[gigData.cover, ...(gigData.images || [])].map(
              (img, index) =>
                img && (
                  <div key={index}>
                    <img src={img} alt={`Gig Image ${index + 1}`} />
                  </div>
                )
            )}
          </Slider>

          {/* ---------- Gig Description ---------- */}
          <h2>About This Gig</h2>
          <p>{gigData.desc}</p>

          {/* ---------- About Seller ---------- */}
          {isLoadingUser ? (
            "Loading seller info..."
          ) : errorUser ? (
            "Something went wrong!"
          ) : (
            <div className="seller">
              <h2>About The Seller</h2>
              <div className="user">
                <Link to={`/seller/${dataUser?._id}`} className="profile-link">
                  <img
                    src={dataUser?.img || "/img/noavatar.jpg"}
                    alt="seller profile"
                  />
                </Link>
                <div className="info">
                  <Link to={`/seller/${dataUser?._id}`} className="profile-link">
                    <span>{dataUser?.username}</span>
                  </Link>
                  {!isNaN(gigData.totalStars / gigData.starNumber) && (
                    <div className="stars">
                      {Array(Math.round(gigData.totalStars / gigData.starNumber))
                        .fill()
                        .map((_, i) => (
                          <img src="/img/star.png" alt="star" key={i} />
                        ))}
                      <span>
                        {Math.round(gigData.totalStars / gigData.starNumber)}
                      </span>
                    </div>
                  )}
                  <button>Contact Me</button>
                </div>
              </div>
              <div className="box">
                <div className="items">
                  <div className="item">
                    <span className="title">From</span>
                    <span className="desc">{dataUser?.country || "N/A"}</span>
                  </div>
                  <div className="item">
                    <span className="title">Member since</span>
                    <span className="desc">Aug 2022</span>
                  </div>
                  <div className="item">
                    <span className="title">Avg. response time</span>
                    <span className="desc">4 hours</span>
                  </div>
                  <div className="item">
                    <span className="title">Last delivery</span>
                    <span className="desc">1 day</span>
                  </div>
                  <div className="item">
                    <span className="title">Languages</span>
                    <span className="desc">English</span>
                  </div>
                </div>
                <hr />
                <p>{dataUser?.desc || "No seller description available."}</p>
              </div>
            </div>
          )}

          {/* ---------- Reviews Section ---------- */}
          <Reviews gigId={id} />
        </div>

        {/* ---------- Right Side ---------- */}
        <div className="right">
          <div className="price">
            <h3>{gigData.shortTitle}</h3>
            <h2>$ {gigData.price}</h2>
          </div>
          <p>{gigData.shortDesc}</p>
          <div className="details">
            <div className="item">
              <img src="/img/clock.png" alt="" />
              <span>{gigData.deliveryDate} Days Delivery</span>
            </div>
            <div className="item">
              <img src="/img/recycle.png" alt="" />
              <span>{gigData.revisionNumber} Revisions</span>
            </div>
          </div>
          <div className="features">
            {gigData.features?.length > 0 &&
              gigData.features.map((feature, i) => (
                <div className="item" key={i}>
                  <img src="/img/greencheck.png" alt="" />
                  <span>{feature}</span>
                </div>
              ))}
          </div>
          <Link to={`/pay/${id}`}>
            <button>Continue</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Gig;
