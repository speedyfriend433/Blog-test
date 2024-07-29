const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

let posts = [];

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/posts', (req, res) => {
  res.json(posts);
});

app.post('/api/posts', (req, res) => {
  const post = req.body;
  posts.push(post);
  res.status(201).json(post);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
