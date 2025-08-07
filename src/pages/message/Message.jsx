import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Message.scss";

const Message = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

  const queryClient = useQueryClient();

  // ✅ Fetch messages safely
  const { isLoading, error, data = [] } = useQuery({
    queryKey: ["messages", id],
    queryFn: async () => {
      const res = await newRequest.get(`/messages/${id}`);
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: !!id, // only run query if id exists
    refetchInterval: 3000, // auto-refresh messages every 3s (optional live chat)
  });

  // ✅ Send message mutation
  const mutation = useMutation({
    mutationFn: async (message) => {
      return newRequest.post(`/messages`, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", id]); // refresh messages
    },
  });

  // ✅ Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const messageText = e.target[0].value.trim();

    if (!messageText) return; // avoid sending empty messages

    mutation.mutate({
      conversationId: id,
      desc: messageText,
    });

    e.target[0].value = "";
  };

  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/messages">Messages</Link> &gt; John Doe &gt;
        </span>

        {isLoading ? (
          "Loading..."
        ) : error ? (
          "Something went wrong!"
        ) : (
          <div className="messages">
            {data.length > 0 ? (
              data.map((m) => (
                <div
                  className={`item ${
                    m.userId === currentUser?._id ? "owner" : ""
                  }`}
                  key={m._id}
                >
                  <img
                    src="https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600"
                    alt="user"
                  />
                  <p>{m.desc}</p>
                </div>
              ))
            ) : (
              <p className="no-messages">No messages yet.</p>
            )}
          </div>
        )}

        <hr />

        <form className="write" onSubmit={handleSubmit}>
          <textarea placeholder="Write a message..." />
          <button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Message;
