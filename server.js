const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

async function loadPosts() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function savePosts(posts) {
  await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), 'utf8');
}

app.get('/api/posts', async (req, res) => {
  const posts = await loadPosts();
  res.json(posts);
});

app.post('/api/posts', async (req, res) => {
  const posts = await loadPosts();
  const post = req.body;
  posts.push(post);
  await savePosts(posts);
  res.status(201).json(post);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
