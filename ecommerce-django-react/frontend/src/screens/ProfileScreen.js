import React, { useState, useEffect } from "react";
/* REACT BOOTSTRAP */
import { Row, Col, Button, Form, Table } from "react-bootstrap";
/* REACT ROUTER BOOTSTRAP */
import { LinkContainer } from "react-router-bootstrap";
/* COMPONENTЫ */
import Message from "../components/Message";
import Loader from "../components/Loader";
/* REACT–REDUX */
import { useDispatch, useSelector } from "react-redux";
/* ACTION CREATORS */
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { listMyOrders } from "../actions/orderActions";
/* ACTION TYPES */
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";

function ProfileScreen({ history }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  // ← тут добавлен || {} и дефолт для user
  const userDetails = useSelector((state) => state.userDetails) || {};
  const { user = {}, loading, error } = userDetails;

  const userLogin = useSelector((state) => state.userLogin) || {};
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile) || {};
  const { success } = userUpdateProfile;

  const orderListMy = useSelector((state) => state.orderListMy) || {};
  const {
    loading: loadingOrders,
    error: errorOrders,
    orders,
  } = orderListMy;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      if (!user.name) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails("profile"));
        dispatch(listMyOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [dispatch, history, userInfo, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Пароли не совпадают");
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>Профиль пользователя</h2>
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {success && <Message variant="success">Профиль обновлен</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Имя</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="email" className="mt-3">
            <Form.Label>Адрес электронной почты</Form.Label>
            <Form.Control
              type="email"
              placeholder="Введите email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="password" className="mt-3">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword" className="mt-3">
            <Form.Label>Подтвердите пароль</Form.Label>
            <Form.Control
              type="password"
              placeholder="Подтвердите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="mt-3">
            Обновить
          </Button>
        </Form>
      </Col>

      <Col md={9}>
        <h2>Мои заказы</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant="danger">{errorOrders}</Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Дата</th>
                <th>Сумма</th>
                <th>Оплачено</th>
                <th>Доставлено</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button variant="light" className="btn-sm">
                        Детали
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
}

export default ProfileScreen;
