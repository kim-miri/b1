const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const sha = require("sha256");
const session = require("express-session");

const url =
  "mongodb+srv://admin:1234@cluster0.dlxi4ez.mongodb.net/?retryWrites=true&w=majority";

const app = express();

app.use(express.json());

// 모든 도메인에서의 요청을 허용
// CORS 설정
const corsOptions = {
  origin: "https://web-react-jvpb2alnzpcko1.sel5.cloudtype.app", // 허용할 출처
  optionsSuccessStatus: 200, // 프리플라이트 요청에 대한 응답 상태 코드
};

app.use(cors(corsOptions));

// SHA 알고리즘
app.use(
  session({
    secret: "dfgcsdga234254fsdcs0sdfs12",
    resave: false,
    saveUninitialized: true,
  })
);

// MongoDB 연결
let mydb;
mongoose
  .connect(url)
  .then((client) => {
    console.log("MongoDB Connected...");
    // mongoose.connection.db를 통해 데이터베이스 참조
    mydb = mongoose.connection.db;
  })
  .catch((err) => console.log(err));

// Post 스키마 정의
const postSchema = new mongoose.Schema({
  id: String,
  title: String,
  content: String,
  wdate: { type: Date, default: Date.now }, // wdate를 Date 타입으로 변경. 작성 날짜를 기준으로 정렬하기 위해
  writer: String,
});

// Post 모델 정의
const Post = mongoose.model("Post", postSchema);

// 세션 설정. 앞으로 옮겨 놓는게 좋야 됨
app.use(
  session({
    // 세션 아이디 암호화를 위한 재료 값
    secret: "dfgcsdga234254fsdcs0sdfs12",
    // 세션을 접속할 때마다 새로운 세션 식별자(sid)의 발급 여부를 결정. 일반적으로 false로 설정
    resave: false,
    // 세션을 사용하기 전까지 세션 식별자를 발급하지 않도록 함. 일반적으로 true 설정
    saveUninitialized: true,
  })
);

// login
const checkUserSession = (req, res) => {
  if (req.session.user) {
    console.log("세션 유지");
    res.json({ user: req.session.user });
  } else {
    res.json({ user: null });
  }
};

app.get("/login", checkUserSession);
app.get("/", checkUserSession);

app.post("/login", async (req, res) => {
  const { userId, userPw } = req.body;
  console.log(`id: ${userId}`);
  console.log(`pw: ${userPw}`);

  try {
    // 여기서 비번 확인은 안됨. 해시로 변환된 값을 비교하기 때문에
    const result = await mydb.collection("account").findOne({ userId });

    if (!result) {
      return res.json({ error: "사용자를 찾을 수 없습니다" });
    } else if (result.userPw && result.userPw === sha(userPw)) {
      req.session.user = { userId, userPw };
      console.log("새로운 로그인");
      res.json({ user: req.session.user });
    } else {
      return res.json({ error: "비밀번호가 틀렸습니다" });
    }
  } catch (error) {
    console.error("로그인 에러:", error);
    res.status(500).json({ error: "서버 오류" });
  }
});

// logout
app.get("/logout", (req, res) => {
  console.log("로그아웃");
  // 현재 도메인의 세션 삭제
  req.session.destroy();

  // 로그아웃에 성공했을 때 user에 null 넘김
  res.json({ user: null });
});

// 회원가입
// app.get("/signup", (req, res) => {
//   res.render("signup");
// });

app.post("/signup", async (req, res) => {
  console.log(req.body.userId);
  console.log(req.body.userPw);
  console.log(req.body.userGroup);
  console.log(req.body.userEmail);

  try {
    const collection = mydb.collection("account");
    await collection.insertOne({
      userId: req.body.userId,
      // userPw: req.body.userPw,
      // 암호화된 해시값으로 저장됨
      userPw: sha(req.body.userPw),
      userGroup: req.body.userGroup,
      userEmail: req.body.userEmail,
    });

    console.log("회원가입 성공");
    res.json({ message: "회원가입 성공" });
  } catch (error) {
    console.error("회원가입 에러:", error);
    res.status(500).send("Server error");
  }
});

// GET /posts
app.get("/posts", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;

    const skip = (page - 1) * perPage;
    const [posts, totalPosts] = await Promise.all([
      Post.find().sort({ wdate: -1 }).skip(skip).limit(perPage).lean(),
      Post.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalPosts / perPage);

    res.json({ docs: posts, totalPages });
  } catch (err) {
    console.error("posts err", err);
    res.status(500).send("Server error");
  }
});

// GET /posts/total
app.get("/posts/total", async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();
    res.json({ total: totalPosts });
  } catch (err) {
    console.error("err", err);
    res.status(500).send("Server error");
  }
});

//게시글 읽기
app.get("/posts/read/:id", async (req, res) => {
  const postId = req.params.id; // 클라이언트에서 전달한 게시물 ID
  console.log("postId", postId);

  try {
    const post = await Post.findOne({ _id: postId }).lean();
    if (!post) {
      return res.status(404).json({ error: "게시물을 찾을 수 없습니다." });
    }
    res.json(post);
  } catch (err) {
    console.error("err", err);
    res.status(500).send("Server error");
  }
});

//게시글 등록
app.post("/posts/write", async (req, res) => {
  const { title, content, writer, wdate } = req.body;
  try {
    const newPost = new Post({ title, content, writer, wdate });
    await newPost.save();
    res.sendStatus(200);
  } catch (error) {
    console.error("작성 에러:", error);
    res.status(500).send("Server error");
  }
});

//게시글 수정
app.post("/posts/update", async (req, res) => {
  const { id, title, content, writer, wdate } = req.body;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "유효하지 않은 게시물 ID입니다." });
  }
  try {
    await Post.updateOne({ _id: id }, { title, content, writer, wdate });
    res.sendStatus(200);
  } catch (error) {
    console.error("작성 에러:", error);
    res.status(500).send("Server error");
  }
});

//게시글 삭제
app.post("/posts/delete/:id", async (req, res) => {
  const postId = req.params.id;
  if (!ObjectId.isValid(postId)) {
    return res.status(400).json({ error: "유효하지 않은 게시물 ID입니다." });
  }
  try {
    await Post.deleteOne({ _id: postId });
    res.sendStatus(200);
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send("Server error");
  }
});

// 에러 핸들링: 에러 처리하는 로직이 중복되어 있어 한 곳에 처리
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server error");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("서버 실행");
});
