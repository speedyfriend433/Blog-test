const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const path = require('path');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const app = express();
const port = process.env.PORT || 3000;
const SECRET_KEY = 'your_secret_key'; 
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

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


const sessionStore = new SequelizeStore({
  db: sequelize
});

app.use(session({
  secret: SECRET_KEY,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 180 * 60 * 1000 } 
}));

sessionStore.sync();

sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Failed to sync database:', err));

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword
    });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    req.session.userId = user.id;
    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.json({ message: 'Logout successful' });
  });
});

const authenticate = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Access denied' });
  }
  next();
};

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load posts' });
  }
});

app.post('/api/posts', authenticate, async (req, res) => {
  const { title, content } = req.body;
  const username = req.session.userId;
  const currentDate = new Date();
  const timeString = currentDate.toLocaleDateString() + ' at ' + currentDate.toLocaleTimeString();

  try {
    const user = await User.findByPk(req.session.userId);
    const newPost = await Post.create({
      username: user.username,
      title,
      content,
      time: timeString
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

app.post('/api/comments', authenticate, async (req, res) => {
  const { postId, content } = req.body;
  const username = req.session.userId;
  const currentDate = new Date();
  const timeString = currentDate.toLocaleDateString() + ' at ' + currentDate.toLocaleTimeString();

  try {
    const user = await User.findByPk(req.session.userId);
    const newComment = await Comment.create({
      postId,
      username: user.username,
      content,
      time: timeString
    });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save comment' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
