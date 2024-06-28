import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import "../styles/product-details.css";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { db } from "../firebase.config";
import { addDoc, collection } from "firebase/firestore";
import useGetData from "../custom-hooks/useGetData";
import requests from "../Requests";
import axios from "axios";

const ProductDetails = () => {
  const [recipes, setRecipes] = useState([]);
  const [rcp, setRcp] = useState([]);
  const [ingre, setIngre] = useState([]);
  const [tab, setTab] = useState("desc");
  const reviewUser = useRef("");
  const reviewMsg = useRef("");
  const [health, setHealth] = useState();
  const [diet, setDiet] = useState();
  const [tags, setTags] = useState();
  const { data: reviews } = useGetData("reviews");

  const [rating, setRating] = useState(null);
  let { label } = useParams();

  // Fetch the recipes from the API
  useEffect(() => {
    axios.get(requests.requestAll).then((response) => {
      setRecipes(response.data.hits);
    });
  }, []);

  // Find the recipe based on the label
  useEffect(() => {
    if (recipes.length > 0) {
      const foundRecipe = recipes.find(
        (item) => item.recipe.label === decodeURIComponent(label)
      );
      if (foundRecipe) {
        setRcp(foundRecipe.recipe);
        setIngre(foundRecipe.recipe.ingredients);
        setHealth(foundRecipe.recipe.healthLabels);
        setDiet(foundRecipe.recipe.dietLabels);
        setTags(foundRecipe.recipe.tags);
      } else {
        console.log("Recipe not found");
      }
    } else {
      console.log("Recipes not loaded yet");
    }
  }, [recipes, label]);

  const submitHandler = (e) => {
    e.preventDefault();

    const reviewUserName = reviewUser.current.value;
    const reviewUserMsg = reviewMsg.current.value;
    const reviewObj = {
      label,
      userName: reviewUserName,
      text: reviewUserMsg,
      rating,
    };
    const docRef = collection(db, "reviews");
    addDoc(docRef, reviewObj);
    toast.success("Review submitted!");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [rcp]);

  // Format the ingredient object into a readable string
  const formatIngredient = (ingredient) => {
    const { text, quantity, measure, food } = ingredient;
    return `${quantity ? quantity : ""} ${measure ? measure : ""} ${
      food ? food : text
    }`;
  };

  console.log(rcp);

  return (
    <Helmet title={rcp.label}>
      <CommonSection title={rcp.label} />
      <section className="pt-0">
        <Container>
          <Row>
            <Col lg="6">
              {rcp.images ? (
                <img src={rcp.image} alt={rcp.label} />
              ) : (
                <p>Loading image...</p>
              )}
            </Col>
            <Col lg="6">
              <div className="product__details">
                <h2>{rcp.label}</h2>
                <div className="product__rating d-flex align-items-center gap-5 mb-3">
                  <div>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-half-s-line"></i>
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-5">
                  <span className="fw-semibold">Dish Type: {rcp.dishType}</span>
                  <span className="fw-semibold">Meal Type: {rcp.mealType}</span>
                  <span className="fw-semibold">
                    Cuisine Type: {rcp.cuisineType}
                  </span>
                </div>
                {
                  <ul className="ingredients">
                    <span className="fw-bold">Ingredients</span>
                    {ingre.map((item, index) => (
                      <li key={index}>{formatIngredient(item)}</li>
                    ))}
                  </ul>
                }
                {health && health.length > 0 && (
                  <div>
                    <span className="health-labels">Health Labels</span>
                    <div className="tags-container">
                      {health.map((item, index) => (
                        <span className="tag" key={index}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {diet && diet.length > 0 && (
                  <div>
                    <span className="health-labels">Diet Labels</span>
                    <div className="tags-container">
                      {diet.map((item, index) => (
                        <span className="tag" key={index}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {tags && tags.length > 0 && (
                  <div>
                    <span className="health-labels">Tags</span>
                    <div className="tags-container">
                      {tags.map((item, index) => (
                        <span className="tag" key={index}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <div className="tab__wrapper d-flex align-items-center gap-5">
                <h6
                  className={`${tab === "desc" ? "active__tab" : ""}`}
                  onClick={() => setTab("desc")}
                >
                  Description
                </h6>
                <h6
                  className={`${tab === "rev" ? "active__tab" : ""}`}
                  onClick={() => setTab("rev")}
                >
                  Reviews
                </h6>
              </div>

              {tab === "desc" ? (
                <div className="tab__content mt-5">
                  {<p>{rcp.ingredientLines}</p>}
                </div>
              ) : (
                <div className="product__review mt-5">
                  <div className="review__wrapper">
                    <ul>
                      {reviews.map((item, index) => (
                        <li key={index} className="mb-4">
                          <h6>{item.userName}</h6>
                          <span>{item.rating} (rating)</span>
                          <p>{item.text}</p>
                        </li>
                      ))}
                    </ul>
                    <div className="review__form">
                      <h4>Leave Your Review</h4>
                      <form action="" onSubmit={submitHandler}>
                        <div className="form__group">
                          <input
                            type="text"
                            placeholder="Enter Name"
                            ref={reviewUser}
                          />
                        </div>
                        <div className="form__group d-flex align-items-center gap-5 rating__group">
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(1)}
                          >
                            1 <i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(2)}
                          >
                            2 <i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(3)}
                          >
                            3 <i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(4)}
                          >
                            4 <i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(5)}
                          >
                            5 <i className="ri-star-s-fill"></i>
                          </motion.span>
                        </div>
                        <div className="form__group">
                          <textarea
                            ref={reviewMsg}
                            rows={4}
                            type="text"
                            placeholder="Review Message"
                            required
                          />
                        </div>
                        <motion.button
                          whileTap={{ scale: 1.2 }}
                          type="submit"
                          className="shop__btn"
                        >
                          Submit
                        </motion.button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </Col>
            <Col lg="12" className="mt-5">
              <h2 className="related__title">You might also like</h2>
            </Col>
            {/* <ProductsList data={relatedProducts} /> */}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default ProductDetails;
