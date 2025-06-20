// src/components/Product.js

import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from './Rating'

function Product({ product }) {
  return (
    <Card className="my-3 p-3 rounded h-90">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>

      <Card.Body>
        {/* Ссылка + название */}
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        {/* —— ВСТАВЬТЕ ЭТУ СТРОКУ, ЧТОБЫ ПОКАЗАТЬ КАТЕГОРИЮ —— */}
        <Card.Subtitle className="mb-2 text-muted">
          {product.category}
        </Card.Subtitle>
        {/* ———————————————————————————————— */}

        {/* Рейтинг и число отзывов */}
        <Rating
          value={product.rating}
          text={`${product.numReviews} отзывов`}
        />

        {/* Цена */}
        <Card.Text as="h3">{product.price} ₽</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
