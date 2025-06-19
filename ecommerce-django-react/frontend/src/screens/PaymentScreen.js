import React, { useState } from "react";

/* REACT BOOTSTRAP */
import { Button, Form, Col } from "react-bootstrap";

/* COMPONENTS */
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";

/* REACT - REDUX */
import { useDispatch, useSelector } from "react-redux";

/* ACTION CREATORS */
import { savePaymentMethod } from "../actions/cartActions";

function PaymentScreen({ history }) {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  if (!shippingAddress.address) {
    history.push("/shipping");
  }

  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />

      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Выберите способ оплаты</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label="PayPal или кредитная карта"
              id="paypal"
              name="paymentMethod"
              value="PayPal"
              checked={paymentMethod === "PayPal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary" className="my-3">
          Продолжить
        </Button>
      </Form>
    </FormContainer>
  );
}

export default PaymentScreen;
