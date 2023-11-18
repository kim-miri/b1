import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import PostList from "./PostList";
import PostRead from "./PostRead";
import PostUpdate from "./PostUpdate";
import PostWrite from "./PostWrite";
import SignUp from "./SignUp";

const RouterPage = () => {
  const navigator = useNavigate();
  const onClickHome = (e) => {
    e.preventDefault();
    navigator("/");
  };
  const onClickPosts = (e) => {
    e.preventDefault();
    navigator("/posts");
  };
  const onClickJoin = (e) => {
    e.preventDefault();
    navigator("/signup");
  };

  const onClickLog = (e) => {
    e.preventDefault();
    navigator("/login");
  };

  return (
    <div>
      <Navbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#" onClick={onClickHome}>
            React
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#" onClick={onClickPosts}>
                게시글
              </Nav.Link>
              <Nav.Link href="#" onClick={onClickJoin}>
                회원가입
              </Nav.Link>
              <Nav.Link href="#" onClick={onClickLog}>
                로그인
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/write" element={<PostWrite />} />
        <Route path="/posts/:id" element={<PostRead />} />
        <Route path="/posts/update/:id" element={<PostUpdate />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default RouterPage;
