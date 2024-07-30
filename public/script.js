document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
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

    document.getElementById('exportDataButton').addEventListener('click', handleExportData);
    document.getElementById('importDataButton').addEventListener('click', handleImportData);

    loadPosts();
});

let isAuthenticated = false;
let isAdmin = false;

function checkAuthStatus() {
    fetch('/api/checkAuth', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.isAuthenticated) {
            isAuthenticated = true;
            isAdmin = data.username === 'admin';
            document.getElementById('loginLink').style.display = 'none';
            document.getElementById('registerLink').style.display = 'none';
            document.getElementById('logoutLink').style.display = 'block';
            document.getElementById('newPostButton').style.display = 'block';
            if (isAdmin) {
                document.getElementById('adminActions').style.display = 'block';
            }
        } else {
            isAuthenticated = false;
            isAdmin = false;
            document.getElementById('loginLink').style.display = 'block';
            document.getElementById('registerLink').style.display = 'block';
            document.getElementById('logoutLink').style.display = 'none';
            document.getElementById('newPostButton').style.display = 'none';
            document.getElementById('adminActions').style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Error checking auth status:', error);
    });
}

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
            isAdmin = username === 'admin';
            document.getElementById('loginLink').style.display = 'none';
            document.getElementById('registerLink').style.display = 'none';
            document.getElementById('logoutLink').style.display = 'block';
            document.getElementById('newPostButton').style.display = 'block';
            if (isAdmin) {
                document.getElementById('adminActions').style.display = 'block';
            }
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
            isAdmin = false;
            document.getElementById('loginLink').style.display = 'block';
            document.getElementById('registerLink').style.display = 'block';
            document.getElementById('logoutLink').style.display = 'none';
            document.getElementById('newPostButton').style.display = 'none';
            document.getElementById('adminActions').style.display = 'none';
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
    const content = document.getElementById('content').value;    fetch('/api/posts', {
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

function handleExportData(event) {
    event.preventDefault();

    fetch('/api/export', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Data exported successfully') {
            alert('Data exported successfully');
        } else {
            alert('Failed to export data');
        }
    })
    .catch(error => {
        console.error('Error exporting data:', error);
    });
}

function handleImportData(event) {
    event.preventDefault();

    fetch('/api/import', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Data imported successfully') {
            alert('Data imported successfully');
            loadPosts();
        } else {
            alert('Failed to import data');
        }
    })
    .catch(error => {
        console.error('Error importing data:', error);
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

    if (isAdmin) {
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', function() {
            editPost(post);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
            deletePost(post.id);
        });

        postContainer.appendChild(editButton);
        postContainer.appendChild(deleteButton);
    }

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

function editPost(post) {
    const newTitle = prompt('Enter new title:', post.title);
    const newContent = prompt('Enter new content:', post.content);

    if (newTitle !== null && newContent !== null) {
        fetch(`/api/posts/${post.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: newTitle, content: newContent })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Post updated successfully') {
                alert('Post updated successfully');
                loadPosts();
            } else {
                alert('Failed to update post');
            }
        })
        .catch(error => {
            console.error('Error updating post:', error);
        });
    }
}

function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        fetch(`/api/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Post deleted successfully') {
                alert('Post deleted successfully');
                loadPosts();
            } else {
                alert('Failed to delete post');
            }
        })
        .catch(error => {
            console.error('Error deleting post:', error);
        });
    }
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
