import React, { useEffect } from "react";
/* REACT ROUTER */
import { Link } from "react-router-dom";
/* REACT BOOTSTRAP */
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
/* COMPONENTЫ */
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
/* REACT - REDUX */
import { useDispatch, useSelector } from "react-redux";
/* ACTION CREATORS */
import { createOrder } from "../actions/orderActions";
/* ACTION TYPES */
import { ORDER_CREATE_RESET } from "../constants/orderConstants";

function PlaceOrderScreen({ history }) {
  const dispatch = useDispatch();

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, error, success } = orderCreate;

  const cart = useSelector((state) => state.cart);

  // Расчёты цен
  cart.itemsPrice = Number(
    cart.cartItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2)
  );
  cart.shippingPrice = Number(
    (cart.itemsPrice > 100 ? 0 : 10).toFixed(2)
  );
  cart.taxPrice = Number((0.082 * cart.itemsPrice).toFixed(2));
  cart.totalPrice = Number(
    (
      cart.itemsPrice +
      cart.shippingPrice +
      cart.taxPrice
    ).toFixed(2)
  );

  if (!cart.paymentMethod) {
    history.push("/payment");
  }

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [dispatch, history, success, order]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />

      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            {/* Доставка */}
            <ListGroup.Item>
              <h2>Доставка</h2>
              <p>
                <strong>Адрес доставки: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            {/* Оплата */}
            <ListGroup.Item>
              <h2>Оплата</h2>
              <p>
                <strong>Метод оплаты: </strong>
                {cart.paymentMethod}
              </p>
            </ListGroup.Item>

            {/* Товары заказа */}
            <ListGroup.Item>
              <h2>Товары</h2>
              {cart.cartItems.length === 0 ? (
                <Message variant="info">Ваша корзина пуста</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x{" "}
                          {item.price.toLocaleString("ru-RU", {
                            style: "currency",
                            currency: "RUB",
                          })}{" "}
                          ={" "}
                          {(item.qty * item.price).toLocaleString("ru-RU", {
                            style: "currency",
                            currency: "RUB",
                          })}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Сводка заказа */}
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Сводка заказа</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Товары:</Col>
                  <Col>
                    {cart.itemsPrice.toLocaleString("ru-RU", {
                      style: "currency",
                      currency: "RUB",
                    })}
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Доставка:</Col>
                  <Col>
                    {cart.shippingPrice.toLocaleString("ru-RU", {
                      style: "currency",
                      currency: "RUB",
                    })}
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Налог:</Col>
                  <Col>
                    {cart.taxPrice.toLocaleString("ru-RU", {
                      style: "currency",
                      currency: "RUB",
                    })}
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Итого:</Col>
                  <Col>
                    {cart.totalPrice.toLocaleString("ru-RU", {
                      style: "currency",
                      currency: "RUB",
                    })}
                  </Col>
                </Row>
              </ListGroup.Item>

              {error && (
                <ListGroup.Item>
                  <Message variant="danger">{error}</Message>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  type="button"
                  className="w-100"
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Оформить заказ
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrderScreen;
