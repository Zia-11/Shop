// src/components/ProductCarousel.js

import React, { useEffect } from "react";
/* REACT BOOTSTRAP */
import { Carousel, Image } from "react-bootstrap";
/* REACT - REDUX */
import { useDispatch, useSelector } from "react-redux";
/* REACT ROUTER */
import { Link } from "react-router-dom";
/* COMPONENTЫ */
import Loader from "./Loader";
import Message from "./Message";
/* ACTION CREATORS */
import { listTopProducts } from "../actions/productActions";

function ProductCarousel() {
  const dispatch = useDispatch();

  const productTopRated = useSelector((state) => state.productTopRated);
  const { loading, error, products } = productTopRated;

  useEffect(() => {
    dispatch(listTopProducts());
  }, [dispatch]);

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <Carousel
      pause="hover"
      className="bg-dark"
      controls={false}     
      indicators={false}    
    >
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />

            <Carousel.Caption className="carousel-caption">
              <h4>
                {product.name} (
                {product.price.toLocaleString("ru-RU", {
                  style: "currency",
                  currency: "RUB",
                })}
                )
              </h4>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ProductCarousel;
