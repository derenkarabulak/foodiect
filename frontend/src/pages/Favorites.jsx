import React, { useEffect, useState } from "react";
import "../styles/cart.css";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { Col, Container, Row } from "reactstrap";
import { motion } from "framer-motion";
import { favActions } from "../redux/slices/favSlice";
import { useSelector, useDispatch } from "react-redux";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import useAuth from "../custom-hooks/useAuth";
import useGetData from "../custom-hooks/useGetData";

const Favorites = () => {
  //const favItems = useSelector((state) => state.fav.favItems);
  const { data: users } = useGetData("users");
  const [favs, setFavs] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    window.scroll(0, 0);
    if (currentUser) {
      for (let index = 0; index < users.length; index++) {
        if (users[index].uid === currentUser.uid) {
          setFavs(users[index].favorites);
        }
      }
    } else {
      setFavs(null);
    }
  }, [users, currentUser.uid]);

  const Tr = ({ item }) => {
    const dispatch = useDispatch();

    const deleteFav = async (item) => {
      try {
        const userDocRef = doc(db, "users", currentUser.uid);

        const favObj = {
          id: item.id,
          label: item.label,
          dishType: item.dishType,
          cuisineType: item.cuisineType,
          image: item.image,
        };

        await updateDoc(userDocRef, {
          favorites: arrayRemove(favObj),
        });

        setFavs((prevFavs) => prevFavs.filter((fav) => fav.id !== item.id));
        toast.success("Favorite deleted!");
      } catch (error) {
        console.error("Error deleting favorite: ", error);
        toast.error("Error deleting favorite.");
      }
    };
    return (
      <tr>
        <td>
          <img src={item.image} alt="" />
        </td>
        <td>{item.label}</td>
        <td>{item.dishType}</td>
        <td>{item.cuisineType}</td>
        <td>
          <motion.i
            whileTap={{ scale: 1.2 }}
            onClick={() => deleteFav(item)}
            className="ri-delete-bin-line"
          ></motion.i>
        </td>
      </tr>
    );
  };

  return (
    <Helmet title="Favorites">
      <CommonSection title="Favorites" />
      <section>
        <Container>
          <Row>
            <Col lg="9">
              {favs.length === 0 ? (
                <h2 className="fs-4 text-center">
                  No items added to the favorites
                </h2>
              ) : (
                <table className="table bordered">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Dish Type</th>
                      <th>Cuisine Type</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {favs.map((item, index) => (
                      <Tr item={item} key={index} />
                    ))}
                  </tbody>
                </table>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Favorites;
