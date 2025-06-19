import React, { useState, useEffect } from "react";
/* AXIOS */
import axios from "axios";
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
import { listProductDetails, updateProduct } from "../actions/productActions";
/* ACTION TYPES */
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";

function ProductEditScreen({ match, history }) {
  const productId = match.params.id;
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { product, loading, error } = productDetails;
  const productUpdate = useSelector((state) => state.productUpdate);
  const { success: successUpdate, loading: loadingUpdate, error: errorUpdate } = productUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      history.push("/admin/productlist");
    } else {
      if (!product.name || product._id !== Number(productId)) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
  }, [dispatch, product, productId, history, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateProduct({
      _id: productId,
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description,
    }));
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    formData.append("product_id", productId);
    setUploading(true);
    try {
      const config = { header: { "Content-Type": "multipart/form-data" } };
      const { data } = await axios.post("/api/products/upload/", formData, config);
      setImage(data);
      setUploading(false);
    } catch {
      setUploading(false);
    }
  };

  return (
    <div>
      <Link to="/admin/productlist">← Назад к списку товаров</Link>

      <FormContainer>
        <h1>Редактировать товар</h1>

        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="mt-3">
              <Form.Label>Название</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите название"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="price" className="mt-3">
              <Form.Label>Цена</Form.Label>
              <Form.Control
                type="number"
                placeholder="Введите цену"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="image" className="mt-3">
              <Form.Label>Изображение</Form.Label>
              <Form.Control
                type="text"
                placeholder="URL изображения"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <Form.File
                id="image-file"
                label="Выбрать файл"
                custom
                onChange={uploadFileHandler}
              />
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId="brand" className="mt-3">
              <Form.Label>Бренд</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите бренд"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="countInStock" className="mt-3">
              <Form.Label>Количество на складе</Form.Label>
              <Form.Control
                type="number"
                placeholder="Введите количество"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="category" className="mt-3">
              <Form.Label>Категория</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите категорию"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="description" className="mt-3">
              <Form.Label>Описание</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Введите описание"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-4">
              Сохранить изменения
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  );
}

export default ProductEditScreen;
