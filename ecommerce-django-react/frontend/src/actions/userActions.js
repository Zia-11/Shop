/* AXIOS */
import axios from "axios";

/* ТИПЫ ДЕЙСТВИЙ */
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_RESET,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
} from "../constants/userConstants";

import { ORDER_LIST_MY_RESET } from "../constants/orderConstants";

/* КРЕАТОР ДЕЙСТВИЯ ДЛЯ ВХОДА ПОЛЬЗОВАТЕЛЯ (LoginScreen и Header) */
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    /* Формируем заголовки для JSON */
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    /* Отправляем POST-запрос для получения токена */
    const { data } = await axios.post(
      "/api/users/login/",
      { username: email, password },
      config
    );

    /* Успешный вход — сохраняем данные в стор */
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    /* Сохраняем информацию о пользователе в localStorage */
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

/* КРЕАТОР ДЕЙСТВИЯ ДЛЯ ВЫХОДА ПОЛЬЗОВАТЕЛЯ (LoginScreen и Header) */
export const logout = () => (dispatch) => {
  /* Удаляем данные пользователя из localStorage */
  localStorage.removeItem("userInfo");

  /* Сбрасываем состояние пользователя и связанных данных */
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_DETAILS_RESET });
  dispatch({ type: ORDER_LIST_MY_RESET });
  dispatch({ type: USER_LIST_RESET });
};

/* КРЕАТОР ДЕЙСТВИЯ ДЛЯ РЕГИСТРАЦИИ ПОЛЬЗОВАТЕЛЯ (RegisterScreen и Header) */
export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    /* Формируем заголовки для JSON */
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    /* Отправляем POST-запрос для регистрации */
    const { data } = await axios.post(
      "/api/users/register/",
      { name, email, password },
      config
    );

    /* Успешная регистрация — сохраняем данные в стор */
    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    });

    /* Автоматически логиним пользователя после регистрации */
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    /* Сохраняем информацию о пользователе в localStorage */
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

/* КРЕАТОР ДЕЙСТВИЯ ДЛЯ ЗАГРУЗКИ ДЕТАЛЕЙ ПОЛЬЗОВАТЕЛЯ (ProfileScreen) */
export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });

    /* Получаем токен текущего пользователя из стора */
    const {
      userLogin: { userInfo },
    } = getState();

    /* Формируем заголовки с авторизацией */
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    /* Отправляем GET-запрос за данными пользователя */
    const { data } = await axios.get(`/api/users/${id}/`, config);

    /* Сохраняем полученные данные в стор */
    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

/* КРЕАТОР ДЕЙСТВИЯ ДЛЯ ОБНОВЛЕНИЯ ПРОФИЛЯ ПОЛЬЗОВАТЕЛЯ (ProfileScreen) */
export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST });

    /* Получаем токен текущего пользователя из стора */
    const {
      userLogin: { userInfo },
    } = getState();

    /* Формируем заголовки с авторизацией */
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    /* Отправляем PUT-запрос для обновления данных */
    const { data } = await axios.put(
      `/api/users/profile/update/`,
      user,
      config
    );

    /* Сохраняем обновлённые данные в стор */
    dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: data,
    });

    /* Обновляем данные в аутентификации */
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    /* Сохраняем обновлённую информацию в localStorage */
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

/* КРЕАТОР ДЕЙСТВИЯ ДЛЯ ЗАГРУЗКИ СПИСКА ПОЛЬЗОВАТЕЛЕЙ (UserList) */
export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LIST_REQUEST });

    /* Получаем токен текущего пользователя из стора */
    const {
      userLogin: { userInfo },
    } = getState();

    /* Формируем заголовки с авторизацией */
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    /* Отправляем GET-запрос за списком пользователей */
    const { data } = await axios.get(`/api/users/`, config);

    /* Сохраняем полученный список в стор */
    dispatch({
      type: USER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

/* КРЕАТОР ДЕЙСТВИЯ ДЛЯ УДАЛЕНИЯ ПОЛЬЗОВАТЕЛЯ (UserList) */
export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DELETE_REQUEST });

    /* Получаем токен текущего пользователя из стора */
    const {
      userLogin: { userInfo },
    } = getState();

    /* Формируем заголовки с авторизацией */
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    /* Отправляем DELETE-запрос для удаления пользователя */
    await axios.delete(`/api/users/delete/${id}/`, config);

    /* Успешное удаление */
    dispatch({ type: USER_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

/* КРЕАТОР ДЕЙСТВИЯ ДЛЯ ОБНОВЛЕНИЯ ПОЛЬЗОВАТЕЛЯ (UserUpdate) */
export const updateUser = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST });

    /* Получаем токен текущего пользователя из стора */
    const {
      userLogin: { userInfo },
    } = getState();

    /* Формируем заголовки с авторизацией */
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    /* Отправляем PUT-запрос для редактирования данных пользователя */
    const { data } = await axios.put(
      `/api/users/update/${user._id}/`,
      user,
      config
    );

    /* Успешное обновление */
    dispatch({ type: USER_UPDATE_SUCCESS });

    /* Обновляем данные пользователя в сторе */
    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
