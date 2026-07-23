import { createBrowserRouter, Outlet } from "react-router";

import Home from "../Pages/Home/home.jsx";
import Login from "../Pages/Auth/login.jsx";
import Signup from "../Pages/Auth/signup.jsx";
import ProductDetail from "../Pages/Product/productdetail.jsx";
import AddProduct from "../admin/Addproduct.jsx";
import ProductList from "../admin/Productlist.jsx";
import EditProduct from "../admin/Editproduct.jsx";
import Navbar from "../Component/Navbar/navbar.jsx";
import Cart from "../Pages/Cart/cart.jsx";
import Checkout from "../Pages/checkout/cheakout.jsx";
import CheckoutAddress from "../Pages/checkout/cheakoutAddress.jsx";
import OrderSuccess from "../Pages/checkout/OrderSuccess.jsx";
import ProtectedRoute from "..//Component/productroutes.jsx";
import AdminLogin from "../admin/adminLogin.jsx";
import SearchBar from "../Component/searchBar.jsx";
import OrderList from "../admin/OrderList.jsx";


function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/product/:id", element: <ProductDetail /> },
      { path: "/cart", element: <Cart /> },
      {
        path: "/admin/products",
        element: (
          <ProtectedRoute>
            <ProductList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/products/add",
        element: (
          <ProtectedRoute>
            <AddProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/products/edit/:id",
        element: (
          <ProtectedRoute>
            <EditProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/orders",
        element: (
          <ProtectedRoute>
            <OrderList />
          </ProtectedRoute>
        ),
      },
      


      { path: "/checkout", element: <Checkout /> },
      { path: "/checkout-address", element: <CheckoutAddress /> },
      { path: "/order-success/:id", element: <OrderSuccess /> },
      { path: "/admin/login", element: <AdminLogin /> },
      { path: "/search/:keyword", element: <SearchBar /> }

    ],
  },
]);
