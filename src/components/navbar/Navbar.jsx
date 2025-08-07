import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Navbar.scss";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // ✅ Change navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ✅ Handle logout
  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.removeItem("currentUser");
      navigate("/");
      setOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        {/* Logo */}
        <div className="logo">
          <Link className="link" to="/">
            <span className="text">Gigsy</span>
          </Link>
          <span className="dot">.</span>
        </div>

        {/* Navigation Links */}
        <div className="links">
          {/* <Link to="/business" className="link">Fiverr Business</Link>
          <Link to="/explore" className="link">Explore</Link>
          <Link to="/language" className="link">English</Link> */}

          {/* ✅ Direct "Create Gig" button for all logged-in users */}
          {currentUser && (
            <Link to="/add" className="link">
              <button className="create-gig-btn">Create a Gig</button>
            </Link>
          )}

          {/* ✅ User Dropdown or Login/Register */}
          {currentUser ? (
            <div className="user" onClick={() => setOpen((prev) => !prev)}>
              <img src={currentUser.img || "/img/noavatar.jpg"} alt="avatar" />
              <span>{currentUser.username}</span>
              {open && (
                <div className="options">
                  <Link className="link" to="/mygigs">My Gigs</Link>
                  <Link className="link" to="/orders">Orders</Link>
                  <Link className="link" to="/messages">Messages</Link>
                  <button onClick={handleLogout} className="link logout-btn">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="link">Sign in</Link>
              <Link className="link" to="/register">
                <button>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Categories Menu */}
      {(active || pathname !== "/") && (
        <>
          <hr />
          <div className="menu">
            <Link className="link menuLink" to="/">Graphics & Design</Link>
            <Link className="link menuLink" to="/">Video & Animation</Link>
            <Link className="link menuLink" to="/">Writing & Translation</Link>
            <Link className="link menuLink" to="/">AI Services</Link>
            <Link className="link menuLink" to="/">Digital Marketing</Link>
            <Link className="link menuLink" to="/">Music & Audio</Link>
            <Link className="link menuLink" to="/">Programming & Tech</Link>
            <Link className="link menuLink" to="/">Business</Link>
            <Link className="link menuLink" to="/">Lifestyle</Link>
          </div>
          <hr />
        </>
      )}
    </div>
  );
}

export default Navbar;
