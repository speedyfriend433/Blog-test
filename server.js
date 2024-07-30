const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = process.env.PORT || 3000;

// SQLite 데이터베이스 설정
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // 데이터베이스 파일 경로
  logging: false // 디버깅을 위해 로그를 비활성화할 수 있습니다.
});

// Post 모델 정의
const Post = sequelize.define('Post', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'undefined'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Comment 모델 정의
const Comment = sequelize.define('Comment', {
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'undefined'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// 데이터베이스 초기화
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Failed to sync database:', err));

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load posts' });
  }
});

app.post('/api/posts', async (req, res) => {
  const { username, title, content, time } = req.body;

  try {
    const newPost = await Post.create({
      username,
      title,
      content,
      time
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save post' });
  }
});

app.get('/api/comments/:postId', async (req, res) => {
  const postId = req.params.postId;
  try {
    const comments = await Comment.findAll({ where: { postId } });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load comments' });
  }
});

app.post('/api/comments', async (req, res) => {
  const { postId, username, content, time } = req.body;

  try {
    const newComment = await Comment.create({
      postId,
      username,
      content,
      time
    });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save comment' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
