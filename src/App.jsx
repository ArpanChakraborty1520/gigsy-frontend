import "./app.scss";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import React from "react";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Gigs from "./pages/gigs/Gigs";
import Gig from "./pages/gig/Gig";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Add from "./pages/add/Add";
import Orders from "./pages/orders/Orders";
import Messages from "./pages/messages/Messages";
import Message from "./pages/message/Message";
import MyGigs from "./pages/myGigs/MyGigs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Pay from "./pages/pay/Pay";
import Success from "./pages/success/Success";
import SellerGigs from "./pages/sellerGigs/SellerGigs"; // ✅ New page

// ✅ Temporary placeholder pages
const Business = () => (
  <div style={{ padding: "40px" }}>
    <h1>Fiverr Business Page</h1>
  </div>
);

const BecomeSeller = () => (
  <div style={{ padding: "40px" }}>
    <h1>Become a Seller Page</h1>
  </div>
);

function App() {
  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <div className="app">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <QueryClientProvider client={queryClient}>
          <Layout />
        </QueryClientProvider>
      ),
      children: [
        { index: true, element: <Home /> },
        { path: "gigs", element: <Gigs /> },
        { path: "myGigs", element: <MyGigs /> },
        { path: "orders", element: <Orders /> },
        { path: "messages", element: <Messages /> },
        { path: "message/:id", element: <Message /> },
        { path: "add", element: <Add /> },
        { path: "gig/:id", element: <Gig /> }, // ✅ Fixed route
        { path: "seller/:userId", element: <SellerGigs /> }, // ✅ New route
        { path: "register", element: <Register /> },
        { path: "login", element: <Login /> },
        { path: "pay/:id", element: <Pay /> },
        { path: "success", element: <Success /> },
        { path: "business", element: <Business /> },
        { path: "become-seller", element: <BecomeSeller /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
