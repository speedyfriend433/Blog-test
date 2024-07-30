const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const port = process.env.PORT || 3000;
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
