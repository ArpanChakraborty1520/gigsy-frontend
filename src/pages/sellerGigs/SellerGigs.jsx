import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import GigCard from "../../components/gigCard/GigCard";
import "./SellerGigs.scss";

const SellerGigs = () => {
  const { userId } = useParams();

  // ✅ Fetch gigs for a specific seller
  const { isLoading, error, data } = useQuery({
    queryKey: ["sellerGigs", userId],
    queryFn: () =>
      newRequest.get(`/gigs?userId=${userId}`).then((res) => res.data),
    enabled: !!userId,
  });

  return (
    <div className="sellerGigs">
      <div className="container">
        <h1>Seller's Gigs</h1>
        <p>All gigs posted by this seller</p>
        <div className="cards">
          {isLoading
            ? "Loading..."
            : error
            ? "Something went wrong!"
            : data?.length > 0
            ? data.map((gig) => <GigCard key={gig._id} item={gig} />)
            : "No gigs found for this seller."}
        </div>
      </div>
    </div>
  );
};

export default SellerGigs;
