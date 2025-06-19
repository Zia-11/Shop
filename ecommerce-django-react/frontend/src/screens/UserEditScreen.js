import React, { useState, useEffect } from "react";
/* REACT ROUTER */
import { Link } from "react-router-dom";
/* REACT BOOTSTRAP */
import { Button, Form } from "react-bootstrap";
/* COMPONENTЫ */
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
/* REACT - REDUX */
import { useDispatch, useSelector } from "react-redux";
/* ACTION CREATORS */
import { getUserDetails, updateUser } from "../actions/userActions";
/* ACTION TYPES */
import { USER_UPDATE_RESET } from "../constants/userConstants";

function UserEditScreen({ match, history }) {
  const userId = match.params.id;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { user, loading, error } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    error: errorUpdate,
    loading: loadingUpdate,
    success: successUpdate,
  } = userUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      history.push("/admin/userlist");
    } else {
      if (!user.name || user._id !== Number(userId)) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [dispatch, user, userId, history, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: user._id, name, email, isAdmin }));
  };

  return (
    <div>
      <Link to="/admin/userlist">← Назад</Link>

      <FormContainer>
        <h1>Редактировать пользователя</h1>

        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="mt-3">
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

            <Form.Group controlId="isAdmin" className="mt-3">
              <Form.Check
                type="checkbox"
                label="Администратор"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-4">
              Обновить
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  );
}

export default UserEditScreen;
