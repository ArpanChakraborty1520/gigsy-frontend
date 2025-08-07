import React from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      newRequest.get(`/orders`).then((res) => {
        return res.data;
      }),
  });

  const handleContact = async (order) => {
    try {
      const sellerId = order.sellerId;
      const buyerId = order.buyerId;
      const id = sellerId + buyerId;

      let res;
      try {
        // Try to get existing conversation
        res = await newRequest.get(`/conversations/single/${id}`);
      } catch (err) {
        // If not found, create new one
        if (err.response && err.response.status === 404) {
          res = await newRequest.post(`/conversations/`, {
            to: currentUser?.isSeller ? buyerId : sellerId,
          });
        } else {
          throw err;
        }
      }

      if (res?.data?.id) {
        navigate(`/message/${res.data.id}`);
      }
    } catch (err) {
      console.error("Error starting conversation:", err);
    }
  };

  return (
    <div className="orders">
      {isLoading ? (
        "Loading..."
      ) : error ? (
        "Something went wrong!"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Orders</h1>
          </div>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <img
                        className="image"
                        src={order.img || "/img/noimage.png"}
                        alt="Order"
                      />
                    </td>
                    <td>{order.title}</td>
                    <td>${order.price}</td>
                    <td>
                      <img
                        className="message"
                        src="/img/message.png"
                        alt="Message"
                        onClick={() => handleContact(order)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
