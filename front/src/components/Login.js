import React, { useState, useCallback } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    userId: "",
    userPw: "",
  });
  const { userId, userPw } = formData;
  const navigate = useNavigate();

  const handleChange = useCallback(
    (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    },
    [formData]
  );

  const handleSubmit = useCallback(
    async (evt) => {
      evt.preventDefault();
      try {
        // 로그인 로직
        const response = await axios.post("/login", formData);

        if (response.data.error) {
          throw new Error("로그인 실패", response.data.error);
        }

        alert("로그인 성공:", response.data);
        navigate("/");
      } catch (error) {
        alert("로그인 에러:", error.message);
      }

      console.log("Form submitted:", formData);
    },
    [formData, navigate]
  );

  return (
    <Container className="mt-5">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>아이디</Form.Label>
          <Form.Control
            type="text"
            name="userId"
            value={userId}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>비밀번호</Form.Label>
          <Form.Control
            type="password"
            name="userPw"
            value={userPw}
            onChange={handleChange}
          />
        </Form.Group>

        <div className="d-grid d-md-flex justify-content-md-end mt-5">
          <Button type="submit" variant="primary">
            로그인
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Login;
