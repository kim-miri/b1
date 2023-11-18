import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";

const SignUp = () => {
  const [formData, setFormData] = useState({
    userId: "",
    userPw: "",
    userGroup: "",
    userEmail: "",
  });
  const { userId, userPw, userGroup, userEmail } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const response = await axios.post("/signup", formData);

      if (response.status !== 200) {
        throw new Error("회원가입 실패");
      }

      alert("회원가입 성공");
      // 회원가입 성공 시 로그인 페이지로 이동하도록 설정
      window.location.href = "/login";
    } catch (error) {
      alert("회원가입 에러:", error);
    }

    console.log("Form submitted:", formData);
  };

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

        <Form.Group className="mb-3">
          <Form.Label>소속</Form.Label>
          <Form.Control
            type="text"
            name="userGroup"
            value={userGroup}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>이메일</Form.Label>
          <Form.Control
            type="email"
            name="userEmail"
            value={userEmail}
            onChange={handleChange}
          />
        </Form.Group>

        <div className="d-grid d-md-flex justify-content-md-end mt-5">
          <Button type="submit" variant="primary">
            회원가입
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default SignUp;
