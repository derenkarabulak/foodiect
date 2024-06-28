import React, { useRef, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./header.css";
import { Container, Row } from "reactstrap";
import userIcon from "../../assets/images/user-icon.png";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import useAuth from "../../custom-hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase.config";
import { toast } from "react-toastify";
import useGetData from "../../custom-hooks/useGetData";

const nav__links = [
  {
    path: "home",
    display: "Home",
  },
  {
    path: "recipes",
    display: "Recipes",
  },
  {
    path: "nutrition",
    display: "Nutrition",
  },
  {
    path: "calorie-calculator",
    display: "CalCalc",
  },
];

const Header = () => {
  const headerRef = useRef(null);
  //const totalFavs = useSelector((state) => state.fav.totalQuantity);
  const profileActionRef = useRef(null);

  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { data: users } = useGetData("users");
  const [favs, setFavs] = useState([]);

  useEffect(() => {
    if (currentUser) {
      for (let index = 0; index < users.length; index++) {
        if (users[index].uid === currentUser.uid) {
          setFavs(users[index].favorites);
        }
      }
    }
  }, [users]);

  const stickyHeaderFunction = () => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("sticky__header");
      } else {
        headerRef.current.classList.remove("sticky__header");
      }
    });
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logged out!");
        navigate("/home");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    stickyHeaderFunction();
    return () => window.removeEventListener("scroll", stickyHeaderFunction);
  });

  const menuToggle = () => {
    menuRef.current.classList.toggle("active__menu");
  };

  const navigateToFavs = () => {
    navigate("/favorites");
  };

  const toggleProfileActions = () => {
    profileActionRef.current.classList.toggle("show__profileActions");
  };

  const totalFavs = currentUser ? favs?.length : 0;

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper">
            <div className="logo">
              <div>
                <h1
                  onClick={() => {
                    navigate("/home");
                  }}
                >
                  Foodiect
                </h1>
              </div>
            </div>
            <div className="navigation" ref={menuRef} onClick={menuToggle}>
              <ul className="menu">
                {nav__links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "nav__active" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="nav__icons">
              <span className="fav__icon" onClick={navigateToFavs}>
                <i className="ri-heart-line"></i>
                <span className="badge">{totalFavs}</span>
              </span>
              <div className="profile">
                <motion.img
                  whileTap={{ scale: 1.2 }}
                  src={currentUser ? currentUser.photoURL : userIcon}
                  alt="profile"
                  onClick={toggleProfileActions}
                />
                <div
                  className="profile__actions"
                  ref={profileActionRef}
                  onClick={toggleProfileActions}
                >
                  {currentUser ? (
                    <div className="d-flex align-items-center justify-content-center flex-column">
                      <span onClick={logout}>Logout</span>
                      <Link to="/dashboard">Dashboard</Link>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center flex-column">
                      <Link to="/signup">Sign up</Link>
                      <Link to="/login">Log in</Link>
                      <Link to="/dashboard">Dashboard</Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="mobile__menu">
                <span onClick={menuToggle}>
                  <i className="ri-menu-line"></i>
                </span>
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
