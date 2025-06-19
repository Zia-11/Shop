import React, { useEffect } from "react";
/* REACT ROUTER BOOTSTRAP */
import { LinkContainer } from "react-router-bootstrap";
/* REACT BOOTSTRAP */
import { Table, Button } from "react-bootstrap";
/* COMPONENTS */
import Message from "../components/Message";
import Loader from "../components/Loader";
/* REACT - REDUX */
import { useDispatch, useSelector } from "react-redux";
/* ACTION CREATORS */
import { listOrders } from "../actions/orderActions";

function OrderListScreen({ history }) {
  const dispatch = useDispatch();

  /* PULLING OUT STATE */
  const orderList = useSelector((state) => state.orderList);
  const { orders, loading, error } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    // НЕ ДОПУСКАЕМ НЕ-АДМИНОВ
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo]);

  return (
    <div>
      <h1>Заказы</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Пользователь</th>
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
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt && order.createdAt.substring(0, 10)}</td>
                <td>
                  {order.totalPrice.toLocaleString("ru-RU", {
                    style: "currency",
                    currency: "RUB",
                  })}
                </td>

                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>

                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>

                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="dark" className="btn-sm">
                      Детали
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default OrderListScreen;