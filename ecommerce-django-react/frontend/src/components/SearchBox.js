// src/components/SearchBox.js

import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";

function SearchBox() {
  const [keyword, setKeyword] = useState("");
  const history = useHistory();
  const { category = "" } = useParams();

  const submitHandler = (e) => {
    e.preventDefault();
    const query = keyword.trim() ? `?keyword=${keyword.trim()}&page=1` : "";
    if (category) {
      history.push(`/category/${category}${query}`);
    } else {
      history.push(`/${query}`);
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Поиск товаров…"
        className="me-2"
      />
      <Button type="submit" className="p-2 search-btn">
        Поиск
      </Button>
    </Form>
  );
}

export default SearchBox;
