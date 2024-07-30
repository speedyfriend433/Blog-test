### README.md

# Blog App

This is a simple blog application built with Node.js, Express, and SQLite. Users can create, view, and persist blog posts.

## Features

- Create new blog posts with a username, title, and content.
- View all blog posts.
- Persist blog posts using SQLite.

## Requirements

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository

```sh
git clone https://github.com/speedyfriend433/blog-test.git
cd blog-test
```

2. Install dependencies

```sh
npm install
```

## Running the Application

1. Start the server

```sh
npm start
```

2. Open your browser and navigate to

```
http://localhost:3000
```

## Deployment

This application can be deployed on platforms like [Render](https://render.com). Follow these steps to deploy:

1. Push your code to a Git repository (e.g., GitHub).
2. Create a new web service on Render and connect it to your repository.
3. Set the build command to `npm install` (or leave it blank).
4. Set the start command to `npm start`.
5. Deploy and open the deployed URL.

## File Structure

```plaintext
/blog-app
  ├── public
  │   ├── index.html
  │   ├── styles.css
  │   └── script.js
  ├── server.js
  ├── database.sqlite
  └── package.json
```

- `public/index.html`: The main HTML file for the frontend.
- `public/styles.css`: CSS file for styling the frontend.
- `public/script.js`: JavaScript file for client-side logic.
- `server.js`: Node.js server file.
- `database.sqlite`: SQLite database file (auto-generated).
- `package.json`: Project metadata and dependencies.

## API Endpoints

### Get All Posts

```
GET /api/posts
```

Returns a list of all blog posts.

### Create a New Post

```
POST /api/posts
```

Creates a new blog post. The request body should include:

- `username` (string)
- `title` (string)
- `content` (string)
- `time` (string)

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
