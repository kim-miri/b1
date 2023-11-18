import axios from "axios";
import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const PostUpdate = () => {
  const { id } = useParams();
  const navigator = useNavigate();
  const currentDate = new Date().toISOString();

  const [form, setForm] = useState({
    title: "",
    content: "",
    writer: "green",
    // wdate: currentDate,
  });

  const { title, content, writer, wdate } = form;

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async () => {
    if (!title || !content) {
      alert("제목이나 내용을 입력하세요");
    } else {
      if (window.confirm("내용을 수정하시겠습니까?")) {
        const updatedForm = {
          id,
          title,
          content,
          writer,
          //wdate: currentDate,  수정
        };
        await axios.post("/posts/update", updatedForm);

        navigator(-1);
      }
    }
  };

  const callAPI = async () => {
    const result = await axios.get("/posts/read/" + id);
    setForm(result.data);
  };

  useEffect(() => {
    callAPI();
  }, []);

  return (
    <Row className="my-5">
      <Col className="px-5">
        <h2 className="text-center">게시글 정보수정</h2>
        <Form>
          <Form.Control
            placeholder="제목을 입력하세요."
            className="my-3"
            name="title"
            value={title}
            onChange={onChange}
          />
          <Form.Control
            as="textarea"
            rows={10}
            placeholder="내용을 입력하세요."
            className="my-3"
            name="content"
            value={content}
            onChange={onChange}
          />
          <Form.Group controlId="writer">
            <Form.Label>작성자</Form.Label>
            <Form.Control
              type="text"
              name="writer"
              value={writer}
              onChange={onChange}
            />
          </Form.Group>
          <Form.Group controlId="wdate">
            <Form.Label>작성일</Form.Label>
            <Form.Control
              type="text"
              name="wdate"
              value={wdate}
              onChange={onChange}
            />
          </Form.Group>
          <div className="text-center mt-3">
            <Button className="mx-2 px-3 btn-sm" onClick={onSubmit}>
              저장
            </Button>
            <Button
              className="mx-2 px-3 btn-sm"
              onClick={callAPI}
              variant="secondary"
            >
              취소
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default PostUpdate;
