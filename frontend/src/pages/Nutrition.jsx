import React, { useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import requests from "../Requests";
import axios from "axios";
import { Col, Container, Form, FormGroup, Row } from "reactstrap";
import "../styles/nutrition.css"; // Importing the custom CSS file for styling

const Nutrition = () => {
  const [ingr, setIngr] = useState("");
  const encodedIngr = encodeURIComponent(ingr);
  const [data, setData] = useState(null);
  const [totalNutr, setTotalNutr] = useState({});
  const [health, setHealth] = useState();
  const [diet, setDiet] = useState();

  const submitHandler = (e) => {
    e.preventDefault();
    axios.get(requests.requestNutrition + encodedIngr).then((response) => {
      setData(response.data);
      setTotalNutr(response.data.totalNutrients);
      setHealth(response.data.healthLabels);
      setDiet(response.data.dietLabels);
    });
  };
  console.log(data);

  return (
    <Helmet title={"Nutrition Analysis"}>
      <CommonSection title={"Nutrition Analysis"} />
      <Container>
        <Row>
          <Col>
            <div className="input-section">
              <h4>Nutrition Analysis for Ingredients</h4>
              <Form onSubmit={submitHandler}>
                <FormGroup className="form__group">
                  <span>Ingredient - Ex. "195 g rice"</span>
                  <input
                    onChange={(e) => setIngr(e.target.value)}
                    value={ingr}
                    type="text"
                    name="ingredient"
                    id="ingredient"
                    className="input-field"
                    placeholder="Enter ingredient"
                  />
                </FormGroup>
                <button className="shop__btn" type="submit">
                  Submit
                </button>
              </Form>
            </div>
            {data && (
              <div className="nutrition-card">
                <h1 className="fw-bold">Nutrition Facts</h1>
                <div className="nutrition-item">
                  <span className="nutr-header">Calories: </span>
                  <span className="nutr-values">{data.calories}</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutr-header">Weight: </span>
                  <span className="nutr-values">{data.totalWeight} g</span>
                </div>
                {totalNutr.CHOLE && (
                  <div className="nutrition-item">
                    <span className="nutr-header">Cholesterol: </span>
                    <span className="nutr-values">
                      {totalNutr.CHOLE.quantity}{" "}
                    </span>
                    <span className="nutr-values">{totalNutr.CHOLE.unit}</span>
                  </div>
                )}
                {totalNutr.FAT && (
                  <div className="nutrition-item">
                    <span className="nutr-header">Fat: </span>
                    <span className="nutr-values">
                      {totalNutr.FAT.quantity}{" "}
                    </span>
                    <span className="nutr-values">{totalNutr.FAT.unit}</span>
                  </div>
                )}
                {health && health.length > 0 && (
                  <div>
                    <span className="nutr-header">Health Labels</span>
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
                    <span className="nutr-header">Health Labels</span>
                    <div className="tags-container">
                      {diet.map((item, index) => (
                        <span className="tag" key={index}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </Helmet>
  );
};

export default Nutrition;
