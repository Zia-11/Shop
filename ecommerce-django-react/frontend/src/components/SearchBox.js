import React, { useState } from "react";
/* REACT BOOTSTRAP */
import { Button, Form } from "react-bootstrap";
/* REACT ROUTER DOM */
import { useHistory } from "react-router-dom";

function SearchBox() {
  const [keyword, setKeyword] = useState("");
  let history = useHistory();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      history.push(`/?keyword=${keyword}&page=1`);
    } else {
      history.push(history.location.pathname);
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        className="me-2"
        placeholder="Поиск товаров…"
      />
      <Button
        type="submit"
        variant="outline-success"
        className="p-2 search-btn"
      >
        Поиск
      </Button>
    </Form>
  );
}

export default SearchBox;
