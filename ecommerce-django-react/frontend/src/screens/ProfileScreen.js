import React, { useEffect, useState } from "react";
/* REACT BOOTSTRAP */
import { Row, Col, Table } from "react-bootstrap";
/* REACT–REDUX */
import { useDispatch, useSelector } from "react-redux";
/* REACT ROUTER BOOTSTRAP */
import { LinkContainer } from "react-router-bootstrap";
/* COMPONENTЫ */
import Message from "../components/Message";
import Loader from "../components/Loader";
/* ACTION CREATORS */
import { getUserDetails } from "../actions/userActions";
import { listMyOrders } from "../actions/orderActions";

function ProfileScreen({ history }) {
  const dispatch = useDispatch();

  // детали пользователя
  const userDetails = useSelector((state) => state.userDetails);
  const { loading: loadingUser, error: errorUser, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // мои заказы
  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      if (!user.name) {
        dispatch(getUserDetails("profile"));
        dispatch(listMyOrders());
      }
    }
  }, [dispatch, history, userInfo, user]);

  return (
    <Row>
      <Col md={3}>
        <h2>Профиль пользователя</h2>
        {loadingUser && <Loader />}
        {errorUser && <Message variant="danger">{errorUser}</Message>}

        {!loadingUser && user && (
          <>
            <p><strong>Имя:</strong> {user.name}</p>
            <p><strong>Адрес электронной почты:</strong> {user.email}</p>
          </>
        )}
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
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.isPaid ? order.paidAt.substring(0, 10) : (<i className="fas fa-times" style={{ color: "red" }} />)}</td>
                  <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : (<i className="fas fa-times" style={{ color: "red" }} />)}</td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <button className="btn btn-light btn-sm">Детали</button>
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
