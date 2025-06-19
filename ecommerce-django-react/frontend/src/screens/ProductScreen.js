import React, { useState, useEffect } from "react";
/* REACT ROUTER */
import { Link } from "react-router-dom";
/* REACT BOOTSTRAP */
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
} from "react-bootstrap";
/* COMPONENTЫ */
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
/* REACT - REDUX */
import { useDispatch, useSelector } from "react-redux";
/* ACTION CREATORS */
import {
  listProductDetails,
  createProductReview,
} from "../actions/productActions";
/* ACTION TYPES */
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";

function ProductScreen({ match, history }) {
  /* STATE */
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();

  /* PULLING STATE */
  const productDetails = useSelector((state) => state.productDetails);
  const { product, loading, error } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProductReview,
  } = productReviewCreate;

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(match.params.id));
  }, [dispatch, match.params.id, successProductReview]);

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview(match.params.id, { rating, comment }));
  };

  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        ← Назад
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>

            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} отзывов`}
                    color="#f8e825"
                  />
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Цена:</strong>{" "}
                  {product.price.toLocaleString("ru-RU", {
                    style: "currency",
                    currency: "RUB",
                  })}
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Описание:</strong> {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Цена:</Col>
                      <Col>
                        <strong>
                          {product.price.toLocaleString("ru-RU", {
                            style: "currency",
                            currency: "RUB",
                          })}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Статус:</Col>
                      <Col>
                        {product.countInStock > 0
                          ? "В наличии"
                          : "Нет в наличии"}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Количество:</Col>
                        <Col xs="auto" className="my-1">
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      className="w-100"
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Добавить в корзину
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={6}>
              <h4>Отзывы</h4>
              {product.reviews.length === 0 && (
                <Message variant="info">Нет отзывов</Message>
              )}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating
                      value={review.rating}
                      color="#f8e825"
                    />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}

                <ListGroup.Item>
                  <h4>Оставить отзыв</h4>
                  {loadingProductReview && <Loader />}
                  {successProductReview && (
                    <Message variant="success">
                      Отзыв отправлен
                    </Message>
                  )}
                  {errorProductReview && (
                    <Message variant="danger">
                      {errorProductReview}
                    </Message>
                  )}

                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Оценка</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) =>
                            setRating(Number(e.target.value))
                          }
                        >
                          <option value="">Выберите...</option>
                          <option value="1">1 - Плохо</option>
                          <option value="2">2 - Удовлетворительно</option>
                          <option value="3">3 - Хорошо</option>
                          <option value="4">4 - Очень хорошо</option>
                          <option value="5">5 - Отлично</option>
                        </Form.Control>
                      </Form.Group>

                      <Form.Group controlId="comment" className="mt-3">
                        <Form.Label>Комментарий</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </Form.Group>

                      <Button
                        type="submit"
                        variant="primary"
                        className="my-3"
                        disabled={loadingProductReview}
                      >
                        Отправить
                      </Button>
                    </Form>
                  ) : (
                    <Message variant="info">
                      Пожалуйста, <Link to="/login">войдите</Link> чтобы оставить отзыв.
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default ProductScreen;
