// src/components/Paginate.js

import React from "react";
/* REACT BOOTSTRAP */
import { Pagination } from "react-bootstrap";
/* REACT ROUTER BOOTSTRAP */
import { LinkContainer } from "react-router-bootstrap";

/**
 * props:
 *  - page: текущий номер
 *  - pages: всего страниц
 *  - category: фильтр (если пусто — выводим все товары)
 */
const Paginate = ({ page, pages, category = "" }) => {
  if (pages <= 1) return null;

  return (
    <Pagination className="justify-content-center">
      {[...Array(pages).keys()].map((x) => (
        <LinkContainer
          key={x + 1}
          to={
            category
              ? `/category/${category}/page/${x + 1}`
              : `/page/${x + 1}`
          }
        >
          <Pagination.Item active={x + 1 === page}>
            {x + 1}
          </Pagination.Item>
        </LinkContainer>
      ))}
    </Pagination>
  );
};

export default Paginate;
