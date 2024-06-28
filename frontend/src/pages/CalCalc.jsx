import React, { useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { Col, Container, Form, FormGroup, Row } from "reactstrap";
import "../styles/calcalc.css";

const CalorieCalculator = () => {
  const [formData, setFormData] = useState({
    Gender: "",
    Age: "",
    Height: "",
    Weight: "",
    Duration: "",
    Heart_Rate: "",
    Body_Temp: "",
  });
  const [calories, setCalories] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Gender: formData.Gender === "male" ? 1 : 0,
        Age: parseInt(formData.Age),
        Height: parseFloat(formData.Height),
        Weight: parseFloat(formData.Weight),
        Duration: parseFloat(formData.Duration),
        Heart_Rate: parseFloat(formData.Heart_Rate),
        Body_Temp: parseFloat(formData.Body_Temp),
      }),
    });
    const data = await response.json();
    setCalories(data.calories);
  };

  return (
    <Helmet title={"Calorie Burn Calculator"}>
      <CommonSection title={"Calorie Burn Calculator"} />
      <Container>
        <Row>
          <Col>
            <div className="input-section">
              <h1 className="calorie-header">Calorie Burn Calculator</h1>
              <Form onSubmit={handleSubmit}>
                <FormGroup className="form__group">
                  <label className="select-header">Gender:</label>
                  <select
                    className="select-tag"
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </FormGroup>
                <FormGroup className="form__group">
                  <label className="select-header">Age:</label>
                  <input
                    type="number"
                    name="Age"
                    value={formData.Age}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <label className="select-header">Height (cm):</label>
                  <input
                    type="number"
                    name="Height"
                    value={formData.Height}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <label className="select-header">Weight (kg):</label>
                  <input
                    type="number"
                    name="Weight"
                    value={formData.Weight}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <label className="select-header">Duration (min):</label>
                  <input
                    type="number"
                    name="Duration"
                    value={formData.Duration}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <label className="select-header">Heart Rate:</label>
                  <input
                    type="number"
                    name="Heart_Rate"
                    value={formData.Heart_Rate}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <label className="select-header">Body Temp (°C):</label>
                  <input
                    type="number"
                    name="Body_Temp"
                    value={formData.Body_Temp}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                <button className="shop__btn" type="submit">
                  Calculate
                </button>
              </Form>
              {calories && (
                <h2 className="mt-5">
                  Calories Burned: {Math.floor(calories)} kcal
                </h2>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </Helmet>
  );
};

export default CalorieCalculator;
