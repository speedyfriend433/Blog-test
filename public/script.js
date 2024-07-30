document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('homeLink').addEventListener('click', showHome);
    document.getElementById('loginLink').addEventListener('click', showLoginForm);
    document.getElementById('registerLink').addEventListener('click', showRegisterForm);
    document.getElementById('logoutLink').addEventListener('click', handleLogout);

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('newPostButton').addEventListener('click', function() {
        document.getElementById('blogForm').style.display = 'block';
    });
    document.getElementById('blogForm').addEventListener('submit', handleNewPost);

    loadPosts();
});

let isAuthenticated = false;

function showHome() {
    document.getElementById('authForms').style.display = 'none';
    document.getElementById('newPostButton').style.display = isAuthenticated ? 'block' : 'none';
    loadPosts();
}

function showLoginForm() {
    document.getElementById('authForms').style.display = 'block';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('authForms').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {
            isAuthenticated = true;
            document.getElementById('loginLink').style.display = 'none';
            document.getElementById('registerLink').style.display = 'none';
            document.getElementById('logoutLink').style.display = 'block';
            showHome();
        } else {
            alert('Login failed');
        }
    })
    .catch(error => {
        console.error('Error logging in:', error);
    });
}

function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            alert('Registration successful');
            showLoginForm();
        } else {
            alert('Registration failed');
        }
    })
    .catch(error => {
        console.error('Error registering:', error);
    });
}

function handleLogout(event) {
    event.preventDefault();

    fetch('/api/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Logout successful') {
            isAuthenticated = false;
            document.getElementById('loginLink').style.display = 'block';
            document.getElementById('registerLink').style.display = 'block';
            document.getElementById('logoutLink').style.display = 'none';
            showHome();
        } else {
            alert('Logout failed');
        }
    })
    .catch(error => {
        console.error('Error logging out:', error);
    });
}

function handleNewPost(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    fetch('/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Failed to save post');
        } else {
            addPostToPage(data);
            document.getElementById('blogForm').reset();
            document.getElementById('blogForm').style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Error saving post:', error);
    });
}

function loadPosts() {
    fetch('/api/posts')
    .then(response => response.json())
    .then(posts => {
        const postsContainer = document.getElementById('posts');
        postsContainer.innerHTML = '';
        posts.forEach(post => {
            addPostToPage(post);
        });
    })
    .catch(error => {
        console.error('Error loading posts:', error);
    });
}

function addPostToPage(post) {
    const postContainer = document.createElement('div');
    postContainer.className = 'post';

    const postTitle = document.createElement('h2');
    postTitle.textContent = post.title;

    const postTime = document.createElement('p');
    postTime.className = 'time';
    postTime.textContent = 'Posted on ' + post.time;

    const postAuthor = document.createElement('p');
    postAuthor.className = 'author';
    postAuthor.textContent = 'Author: ' + post.username;

    const postContent = document.createElement('p');
    postContent.textContent = post.content;

    const commentButton = document.createElement('button');
    commentButton.textContent = 'Show Comments';
    commentButton.addEventListener('click', function() {
        toggleComments(post.id, commentButton);
    });

    const commentSection = document.createElement('div');
    commentSection.className = 'comment-section';
    commentSection.setAttribute('data-post-id', post.id);
    commentSection.style.display = 'none';

    const commentForm = document.createElement('form');
    commentForm.innerHTML = `
        <input type="hidden" name="postId" value="${post.id}">
        <textarea id="commentContent-${post.id}" placeholder="Comment" rows="3" required></textarea>
        <button type="submit">Add Comment</button>
    `;
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const content = document.getElementById(`commentContent-${post.id}`).value;
        const currentDate = new Date();
        const timeString = currentDate.toLocaleDateString() + ' at ' + currentDate.toLocaleTimeString();

        const comment = {
            postId: post.id,
            content,
            time: timeString
        };

        saveComment(comment, commentSection);
        commentForm.reset();
    });

    const commentList = document.createElement('div');
    commentList.className = 'comment-list';

    commentSection.appendChild(commentForm);
    commentSection.appendChild(commentList);

    postContainer.appendChild(postTitle);
    postContainer.appendChild(postTime);
    postContainer.appendChild(postAuthor);
    postContainer.appendChild(postContent);
    postContainer.appendChild(commentButton);
    postContainer.appendChild(commentSection);

    document.getElementById('posts').appendChild(postContainer);
}

function toggleComments(postId, button) {
    const commentSection = button.nextElementSibling;
    if (commentSection.style.display === 'none') {
        commentSection.style.display = 'block';
        button.textContent = 'Close Comments';
        loadComments(postId, commentSection.querySelector('.comment-list'));
    } else {
        commentSection.style.display = 'none';
        button.textContent = 'Show Comments';
    }
}

function saveComment(comment, commentSection) {
    fetch('/api/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(comment)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Failed to save comment');
        } else {
            addCommentToPage(data, commentSection.querySelector('.comment-list'));
        }
    })
    .catch(error => {
        console.error('Error saving comment:', error);
    });
}

function loadComments(postId, commentList) {
    fetch(`/api/comments/${postId}`)
    .then(response => response.json())
    .then(comments => {
        commentList.innerHTML = '';
        comments.forEach(comment => {
            addCommentToPage(comment, commentList);
        });
    })
    .catch(error => {
        console.error('Error loading comments:', error);
    });
}

function addCommentToPage(comment, commentList) {
    const commentContainer = document.createElement('div');
    commentContainer.className = 'comment';

    const commentUsername = document.createElement('p');
    commentUsername.className = 'username';
    commentUsername.textContent = 'Username: ' + comment.username;

    const commentTime = document.createElement('p');
    commentTime.className = 'time';
    commentTime.textContent = 'Posted on ' + comment.time;

    const commentContent = document.createElement('p');
    commentContent.className = 'content';
    commentContent.textContent = comment.content;

    commentContainer.appendChild(commentUsername);
    commentContainer.appendChild(commentTime);
    commentContainer.appendChild(commentContent);

    commentList.appendChild(commentContainer);
}
