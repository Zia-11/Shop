// src/screens/HomeScreen.js

import React, { useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listProducts, listProductCategories } from "../actions/productActions";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import { useParams, useLocation, useHistory } from "react-router-dom";

function HomeScreen() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // читаем из URL
  const { category = "" } = useParams();
  const keyword = params.get("keyword") || "";
  const pageNumber = params.get("page") || 1;

  // узнаём, главная ли страница
  const isHomePage = location.pathname === "/";

  // стейты из Redux
  const { loading, error, products, page, pages } = useSelector(
    (state) => state.productList
  );
  const {
    loading: loadingCat,
    error: errorCat,
    categories,
  } = useSelector((state) => state.productCategoryList);

  // грузим категории и продукты при изменении keyword/category/pageNumber
  useEffect(() => {
    dispatch(listProductCategories());
    dispatch(listProducts(keyword, category, pageNumber));
  }, [dispatch, keyword, category, pageNumber]);

  return (
    <>
      {/* Карусель — только на корневой */}
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
                  onClick={() =>
                    history.push(
                      category === ""
                        ? `/category/${c}${keyword ? `?keyword=${keyword}` : ""}`
                        : `/category/${c}?keyword=${keyword}`
                    )
                  }
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
            keyword={keyword}
          />
        </>
      )}
    </>
  );
}

export default HomeScreen;
