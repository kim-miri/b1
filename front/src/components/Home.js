import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container } from "react-bootstrap";

const LoginButton = () => (
  <Link to="/login">
    <button className="btn btn-warning">로그인</button>
  </Link>
);

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/login")
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        console.error("오류:", error);
      });
  }, []);

  const handleLogout = () => {
    axios
      .get("/logout")
      .then((response) => {
        if (response.data.user === null) {
          setUser(null);
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("오류:", error);
      });
  };

  return (
    <Container className="mt-5">
      <h1>홈입니다.</h1>
      {user ? (
        <div>
          <h3>반갑습니다. {user.userId}님</h3>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        <div>
          <h3>로그인 해주세요.</h3>
          <LoginButton />
          <Link to="/signup" style={{ marginLeft: 10 }}>
            <button className="btn btn-success">회원가입</button>
          </Link>
        </div>
      )}
    </Container>
  );
};

export default Home;
