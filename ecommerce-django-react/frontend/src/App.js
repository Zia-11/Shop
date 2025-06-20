// src/App.js

import React from "react";
/* REACT BOOTSTRAP */
import { Container } from "react-bootstrap";
/* REACT ROUTER */
import { HashRouter as Router, Route } from "react-router-dom";

/* COMPONENTЫ */
import Header from "./components/Header";
import Footer from "./components/Footer";

/* SCREENS */
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";

function App() {
  return (
    <Router>
      <Header />
      <Container>
        <main className="py-3">
          {/* спец. роут для фильтрации + пагинации */}
          <Route
            exact
            path="/category/:category/page/:pageNumber"
            component={HomeScreen}
          />
          {/* только категория */}
          <Route
            exact
            path="/category/:category"
            component={HomeScreen}
          />
          {/* только пагинация (все товары) */}
          <Route
            exact
            path="/page/:pageNumber"
            component={HomeScreen}
          />
          {/* главная */}
          <Route exact path="/" component={HomeScreen} />

          {/* прочие экраны */}
          <Route path="/login" component={LoginScreen} />
          <Route path="/register" component={RegisterScreen} />
          <Route path="/profile" component={ProfileScreen} />
          <Route path="/shipping" component={ShippingScreen} />
          <Route path="/payment" component={PaymentScreen} />
          <Route path="/placeorder" component={PlaceOrderScreen} />
          <Route path="/order/:id" component={OrderScreen} />
          <Route path="/product/:id" component={ProductScreen} />
          <Route path="/cart/:id?" component={CartScreen} />
          <Route path="/admin/userlist" component={UserListScreen} />
          <Route path="/admin/user/:id/edit" component={UserEditScreen} />
          <Route
            path="/admin/productlist"
            component={ProductListScreen}
          />
          <Route
            path="/admin/product/:id/edit"
            component={ProductEditScreen}
          />
          <Route
            path="/admin/orderlist"
            component={OrderListScreen}
          />
        </main>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
