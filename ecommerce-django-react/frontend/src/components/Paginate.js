// src/components/Paginate.js

import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({ page, pages, category = "", keyword = "" }) => {
  if (pages <= 1) return null;

  // хелпер для формирования ссылки
  const getLink = (pageNumber) => {
    const query = `?keyword=${keyword}&page=${pageNumber}`;
    return category
      ? `/category/${category}${query}`
      : `/${query}`;
  };

  return (
    <Pagination className="justify-content-center">
      {[...Array(pages).keys()].map((x) => {
        const pageNum = x + 1;
        return (
          <LinkContainer key={pageNum} to={getLink(pageNum)}>
            <Pagination.Item active={pageNum === page}>
              {pageNum}
            </Pagination.Item>
          </LinkContainer>
        );
      })}
    </Pagination>
  );
};

export default Paginate;
