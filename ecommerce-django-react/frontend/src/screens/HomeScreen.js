// src/screens/HomeScreen.js

import React, { useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  listProducts,
  listProductCategories,
} from "../actions/productActions";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";

function HomeScreen({ match, location, history }) {
  const dispatch = useDispatch();

  // достаём прямо из route-параметров
  const category = match.params.category || "";
  const pageNumber = match.params.pageNumber || 1;

  // определяем домашняя ли это страница (чтобы не показывать карусель на /page/2)
  const isHomePage = location.pathname === "/";

  // стейт
  const { loading, error, products, page, pages } = useSelector(
    (state) => state.productList
  );
  const {
    loading: loadingCat,
    error: errorCat,
    categories,
  } = useSelector((state) => state.productCategoryList);

  useEffect(() => {
    dispatch(listProductCategories());
    dispatch(listProducts(category, pageNumber));
  }, [dispatch, category, pageNumber]);

  return (
    <>
      {/* Карусель только на корневой */}
      {isHomePage && <ProductCarousel />}

      {/* Фильтр по категориям */}
      <Row className="mb-4">
        <Col>
          {loadingCat ? (
            <Loader />
          ) : errorCat ? (
            <Message variant="danger">{errorCat}</Message>
          ) : (
            <>
              <Button
                variant={category === "" ? "dark" : "light"}
                onClick={() => history.push("/")}
                className="me-2 mb-2"
              >
                Все
              </Button>
              {categories.map((c) => (
                <Button
                  key={c}
                  variant={category === c ? "dark" : "light"}
                  onClick={() => history.push(`/category/${c}`)}
                  className="me-2 mb-2"
                >
                  {c}
                </Button>
              ))}
            </>
          )}
        </Col>
      </Row>

      <h1>Котики</h1>

      {/* Сетка товаров */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row className="g-4">
            {products.map((product) => (
              <Col
                key={product._id}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className="d-flex align-items-stretch"
              >
                <Product product={product} />
              </Col>
            ))}
          </Row>

          {/* пагинация */}
          <Paginate
            page={page}
            pages={pages}
            category={category}
          />
        </>
      )}
    </>
  );
}

export default HomeScreen;
