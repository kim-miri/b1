import axios from "axios";
import React, { useState, useEffect } from "react";

const AxiosEx1 = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("/posts")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <>
      {posts.map((post) => (
        <div key={post._id}>
          <p>{post.title}</p>
          <p>{post.writer}</p>
          <p>{post.content}</p>
        </div>
      ))}
    </>
  );
};

export default AxiosEx1;
