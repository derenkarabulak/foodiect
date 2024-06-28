import React from "react";
import { motion } from "framer-motion";
import "../../styles/product-card.css";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { favActions } from "../../redux/slices/favSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ProductDetails from "../../pages/ProductDetails";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import useAuth from "../../custom-hooks/useAuth";
import { db } from "../../firebase.config";

const ProductCard = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const addToFavs = async () => {
    dispatch(
      favActions.addItem({
        id: item.id,
        label: item.label,
        dishType: item.dishType,
        cuisineType: item.cuisineType,
        image: item.image,
      })
    );

    const favObj = {
      id: item.id,
      label: item.label,
      dishType: item.dishType,
      cuisineType: item.cuisineType,
      image: item.image,
    };

    try {
      const userDocRef = doc(db, "users", currentUser.uid);

      await updateDoc(userDocRef, {
        favorites: arrayUnion(favObj),
      });

      console.log("success");
    } catch (error) {
      console.error("Error adding to favorites: ", error);
      toast.error("Error adding product to favorites.");
      navigate("/login");
    }

    toast.success("Recipe added to the favorites!");
  };

  const roundedCalories = Math.round(item.calories);

  return (
    <Col lg="3" md="4" className="mb-2">
      <div className="product__item">
        <div className="product__img">
          <motion.img
            onClick={(e) => {
              e.preventDefault();
              navigate(`/recipe/${item.label}`);
            }}
            whileHover={{ scale: 0.9 }}
            src={item.image}
            alt=""
          />
        </div>
        <div className="p-2 product__info">
          <h3 className="product__name">
            <Link to={`/recipe/${item.label}`}>{item.label}</Link>
          </h3>
          <span>{item.dishType}</span>
        </div>
        <div className="product__card-bottom d-flex align-items-center justify-content-between p-2">
          <span className="price">calories: {roundedCalories}</span>
          <span className="price">time: {item.totalTime} min</span>
          <div>
            <motion.span
              className="inline-block ml-2"
              whileTap={{ scale: 1.2 }}
              onClick={addToFavs}
            >
              <i className="ri-heart-fill"></i>
            </motion.span>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;
