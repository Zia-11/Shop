import React, { useState, useEffect } from "react";
/* REACT ROUTER */
import { Link } from "react-router-dom";
/* REACT BOOTSTRAP */
import { Row, Col, Button, Form } from "react-bootstrap";
/* COMPONENTЫ */
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
/* REACT - REDUX */
import { useDispatch, useSelector } from "react-redux";
/* ACTION CREATORS */
import { register } from "../actions/userActions";

function RegisterScreen({ location, history }) {
  /* STATE */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  /* REDIRECT */
  const redirect = location.search ? location.search.split("=")[1] : "/";

  /* STATE FROM REDUX */
  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo, loading, error } = userRegister;

  /* ЕСЛИ УЖЕ ЗАЛОГИНЕН — ПЕРЕНАПРАВИТЬ */
  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  /* HANDLER */
  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Пароли не совпадают");
    } else {
      dispatch(register(name, email, password));
    }
  };

  return (
    <FormContainer>
      <h1>Регистрация</h1>

      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name" className="mt-3">
          <Form.Label>Имя</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Введите имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="email" className="mt-3">
          <Form.Label>Адрес электронной почты</Form.Label>
          <Form.Control
            required
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password" className="mt-3">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="passwordConfirm" className="mt-3">
          <Form.Label>Подтвердите пароль</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Подтвердите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-4">
          Зарегистрироваться
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          Уже есть аккаунт?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            Войти
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
}

export default RegisterScreen;
