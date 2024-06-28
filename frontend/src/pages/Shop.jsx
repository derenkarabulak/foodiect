import React, { useEffect, useState } from "react";
import CommonSection from "../components/UI/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";
import "../styles/shop.css";
import axios from "axios";
import requests from "../Requests";
import ProductsList from "../components/UI/ProductsList";

const Shop = () => {
  const [recipeQuery, setRecipeQuery] = useState("");
  const [allRecipes, setAllRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [apiFrom, setApiFrom] = useState(0);
  const [apiTo, setApiTo] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchRecipes = async (from, to) => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${requests.requestAll}&from=${from}&to=${to}`
      );
      if (response.data.hits.length === 0) {
        setHasMore(false);
        return;
      }
      const formattedRes = response.data.hits.map((res, index) => {
        return {
          ...res.recipe,
          id: res.recipe.uri, // Ensure unique id using uri or another unique property
        };
      });
      setAllRecipes((prevRecipes) => [...prevRecipes, ...formattedRes]);
      setFilteredRecipes((prevRecipes) => [...prevRecipes, ...formattedRes]);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(apiFrom, apiTo);
  }, [apiFrom, apiTo]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setApiFrom(apiTo);
      setApiTo(apiTo + 20);
    }
  };

  const handleFilter = (e) => {
    const filterValue = e.target.value;
    if (filterValue === "Filter By Dish Type") {
      setFilteredRecipes(allRecipes);
    } else {
      const filtered = allRecipes.filter((item) =>
        item.dishType.includes(filterValue)
      );
      setFilteredRecipes(filtered);
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setRecipeQuery(searchTerm);

    const searchedRecipes = allRecipes.filter((item) =>
      item.label.toLowerCase().includes(searchTerm)
    );
    setFilteredRecipes(searchedRecipes);
  };

  return (
    <Helmet title="Recipes">
      <CommonSection title="Recipes" />

      <section>
        <Container>
          <Row>
            <Col lg="3" md="6">
              <div className="filter__widget">
                <select onChange={handleFilter}>
                  <option>Filter By Dish Type</option>
                  <option value="biscuits and cookies">
                    Biscuits and cookies
                  </option>
                  <option value="bread">Bread</option>
                  <option value="cereals">Cereals</option>
                  <option value="condiments and sauces">
                    Condiments and sauces
                  </option>
                  <option value="desserts">Desserts</option>
                  <option value="drinks">Drinks</option>
                  <option value="main course">Main course</option>
                  <option value="pancake">Pancake</option>
                  <option value="preps">Preps</option>
                  <option value="preserve">Preserve</option>
                  <option value="salad">Salad</option>
                  <option value="sandwiches">Sandwiches</option>
                  <option value="side dish">Side dish</option>
                  <option value="soup">Soup</option>
                  <option value="starter">Starter</option>
                  <option value="sweets">Sweets</option>
                </select>
              </div>
            </Col>
            <Col lg="6" md="12">
              <div className="search__box">
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={handleSearch}
                />
                <span>
                  <i className="ri-search-line"></i>
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            {filteredRecipes.length === 0 ? (
              <h1 className="text-center fs-4">Loading...</h1>
            ) : (
              <ProductsList data={filteredRecipes} />
            )}
            {hasMore && (
              <button className="shop__btn" onClick={loadMore}>
                Load More
              </button>
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Shop;
