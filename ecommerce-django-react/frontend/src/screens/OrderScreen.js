import React, { useState, useEffect } from "react";
/* REACT ROUTER */
import { Link } from "react-router-dom";
/* REACT BOOTSTRAP */
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
/* PAYPAL BUTTONS */
import { PayPalButton } from "react-paypal-button-v2";
/* COMPONENTЫ */
import Message from "../components/Message";
import Loader from "../components/Loader";
/* REACT - REDUX */
import { useDispatch, useSelector } from "react-redux";
/* ACTION CREATORS */
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
/* ACTION TYPES */
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";

function OrderScreen({ history, match }) {
  const orderId = match.params.id;
  const dispatch = useDispatch();
  const [sdkReady, setSdkReady] = useState(false);

  /* STATE */
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Рассчитываем сумму товаров
  if (!loading && !error) {
    order.itemsPrice = Number(
      order.orderItems
        .reduce((acc, item) => acc + item.price * item.qty, 0)
        .toFixed(2)
    );
  }

  // Подгрузка скрипта PayPal
  const addPayPalScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AYgflmsaM7ccNLPlKUiufIyw8-spOE4UuS5XyyTCvhzheA-1EUcZF9qGlgXBZaSKcP5BY0zTc9WgINKe";
    script.async = true;
    script.onload = () => setSdkReady(true);
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }

    if (
      !order ||
      successPay ||
      order._id !== Number(orderId) ||
      successDeliver
    ) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [
    dispatch,
    order,
    orderId,
    successPay,
    successDeliver,
    history,
    userInfo,
  ]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <div>
      <h1>Заказ: {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            {/* Доставка */}
            <ListGroup.Item>
              <h2>Доставка</h2>
              <p>
                <strong>Имя: </strong>
                {order.User.name}
              </p>
              <p>
                <strong>Эл. почта: </strong>
                <a href={`mailto:${order.User.email}`}>{order.User.email}</a>
              </p>
              <p>
                <strong>Адрес доставки: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDeliver ? (
                <Message variant="success">
                  Доставлено:{" "}
                  {order.deliveredAt
                    ? order.deliveredAt.substring(0, 10)
                    : null}
                </Message>
              ) : (
                <Message variant="warning">Не доставлено</Message>
              )}
            </ListGroup.Item>

            {/* Оплата */}
            <ListGroup.Item>
              <h2>Оплата</h2>
              <p>
                <strong>Способ оплаты: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  Оплачено: {order.paidAt.substring(0, 10)}
                </Message>
              ) : (
                <Message variant="warning">Не оплачено</Message>
              )}
            </ListGroup.Item>

            {/* Товары заказа */}
            <ListGroup.Item>
              <h2>Товары заказа</h2>
              {order.orderItems.length === 0 ? (
                <Message variant="info">В заказе нет товаров</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
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
                    {order.itemsPrice.toLocaleString("ru-RU", {
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
                    {order.shippingPrice.toLocaleString("ru-RU", {
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
                    {order.taxPrice.toLocaleString("ru-RU", {
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
                    {order.totalPrice.toLocaleString("ru-RU", {
                      style: "currency",
                      currency: "RUB",
                    })}
                  </Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}

              {loadingDeliver && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDeliver && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn w-100"
                      onClick={deliverHandler}
                    >
                      Отметить как доставлено
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OrderScreen;
