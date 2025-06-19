import React, { useState } from "react";
/* REACT BOOTSTRAP */
import { Button, Form } from "react-bootstrap";
/* COMPONENTЫ */
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
/* REACT - REDUX */
import { useDispatch, useSelector } from "react-redux";
/* ACTION CREATORS */
import { saveShippingAddress } from "../actions/cartActions";

function ShippingScreen({ history }) {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    history.push("/payment");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />

      <h1>Доставка</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label>Адрес</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Введите адрес"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="city" className="mt-3">
          <Form.Label>Город</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Введите город"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="postalCode" className="mt-3">
          <Form.Label>Почтовый индекс</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Введите почтовый индекс"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="country" className="mt-3">
          <Form.Label>Страна</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Введите страну"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </Form.Group>

        <Button className="my-3" type="submit" variant="primary">
          Продолжить
        </Button>
      </Form>
    </FormContainer>
  );
}

export default ShippingScreen;
