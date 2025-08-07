import React, { useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [filters, setFilters] = useState({ min: "", max: "", sort: "sales" });

  const { search } = useLocation();

  // ✅ Fetch gigs only when filters are applied
  const fetchGigs = async () => {
    let queryString = `/gigs${search}`;
    queryString += queryString.includes("?") ? "&" : "?";
    queryString += `min=${filters.min}&max=${filters.max}&sort=${filters.sort}`;
    const res = await newRequest.get(queryString);
    return res.data;
  };

  // ✅ Query runs only when filters change (not on every keystroke)
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ["gigs", search, filters],
    queryFn: fetchGigs,
    keepPreviousData: true,
  });

  // ✅ Apply filters only on button click
  const applyFilters = () => {
    setFilters({ min, max, sort });
  };

  // ✅ Change sorting manually
  const reSort = (type) => {
    setSort(type);
    setFilters((prev) => ({ ...prev, sort: type }));
    setOpen(false);
  };

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">Gigly &gt; Graphics &amp; Design &gt;</span>
        <h1>AI Artists</h1>
        <p>Explore the boundaries of art and technology with Gigly's AI artists</p>

        {/* ---------- Filter & Sort Menu ---------- */}
        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input
              type="number"
              placeholder="min"
              value={min}
              onChange={(e) => setMin(e.target.value)}
            />
            <input
              type="number"
              placeholder="max"
              value={max}
              onChange={(e) => setMax(e.target.value)}
            />
            <button onClick={applyFilters}>Apply</button>
          </div>

          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "sales"
                ? "Best Selling"
                : sort === "createdAt"
                ? "Newest"
                : "Popular"}
            </span>
            <img
              src="./img/down.png"
              alt="sort"
              onClick={() => setOpen((prev) => !prev)}
            />
            {open && (
              <div className="rightMenu">
                {sort !== "sales" && (
                  <span onClick={() => reSort("sales")}>Best Selling</span>
                )}
                {sort !== "createdAt" && (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                )}
                {sort !== "popular" && (
                  <span onClick={() => reSort("popular")}>Popular</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ---------- Gigs Cards ---------- */}
        <div className="cards">
          {isLoading || isFetching
            ? "Loading..."
            : error
            ? "Something went wrong!"
            : data?.length > 0
            ? data.map((gig) => <GigCard key={gig._id} item={gig} />)
            : "No gigs found."}
        </div>
      </div>
    </div>
  );
}

export default Gigs;
