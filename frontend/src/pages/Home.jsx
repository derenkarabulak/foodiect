import React, { useState, useEffect } from "react";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";
import heroImg from "../assets/images/cookie.jpg";
import "../styles/home.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Services from "../services/Services";
import ProductsList from "../components/UI/ProductsList";
import { useNavigate } from "react-router-dom";
import requests from "../Requests";
import axios from "axios";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [apiPage, setApiPage] = useState(0);

  const navigate = useNavigate();

  //const year = new Date().getFullYear();

  useEffect(() => {
    axios.get(requests.requestAll).then((response) => {
      const formattedRes = response.data.hits.map((res, index) => {
        return { ...res.recipe, id: index + 1 };
      });
      setRecipes(formattedRes);
    });
  }, []);

  return (
    <Helmet title={"Home"}>
      <section
        className="hero__section"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <Container>
          <Row>
            <Col lg="6" md="6">
              <div className="hero__content">
                <h2>Make Your Meals Delicious and Appealing!</h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Itaque inventore necessitatibus voluptatibus atque sunt illo
                  veniam officiis, perferendis placeat numquam.
                </p>
                <motion.button
                  onClick={() => navigate("/recipes")}
                  whileTap={{ scale: 1.2 }}
                  className="shop__btn"
                >
                  <Link to="/recipes">See Recipes</Link>
                </motion.button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Services />
      <section className="trending__products">
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h2 className="section__title">Recipes</h2>
            </Col>
            <ProductsList data={recipes} />
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Home;
