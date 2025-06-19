/* AXIOS */
import axios from "axios";

/* ТИПЫ ДЕЙСТВИЙ */
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
} from "../constants/cartConstants";

/* КРЕАТОР ДЕЙСТВИЯ, ИСПОЛЬЗУЕМЫЙ В CartScreen */

/* ДЛЯ ДОБАВЛЕНИЯ ТОВАРОВ В КОРЗИНУ */
export const addToCart = (id, qty) => async (dispatch, getState) => {
  /* ЗАПРОС ДАННЫХ ТОВАРА */
  const { data } = await axios.get(`/api/products/${id}`);

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    },
  });

  /* СОХРАНЕНИЕ CART_ITEMS В LOCAL STORAGE */
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

/* ДЛЯ УДАЛЕНИЯ ТОВАРОВ ИЗ КОРЗИНЫ */
export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  /* СОХРАНЕНИЕ CART_ITEMS В LOCAL STORAGE */
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

/* КРЕАТОР ДЕЙСТВИЯ, ИСПОЛЬЗУЕМЫЙ В ShippingScreen */
/* СОХРАНЕНИЕ АДРЕСА ДОСТАВКИ */
export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });

  /* СОХРАНЕНИЕ ADDRESS В LOCAL STORAGE */
  localStorage.setItem("shippingAddress", JSON.stringify(data));
};

/* КРЕАТОР ДЕЙСТВИЯ, ИСПОЛЬЗУЕМЫЙ В PaymentScreen */
/* СОХРАНЕНИЕ МЕТОДА ОПЛАТЫ */
export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });

  /* СОХРАНЕНИЕ PAYMENT_METHOD В LOCAL STORAGE */
  localStorage.setItem("paymentMethod", JSON.stringify(data));
};
