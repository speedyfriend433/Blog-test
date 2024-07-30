document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
    document.getElementById('newPostButton').addEventListener('click', function() {
        document.getElementById('blogForm').style.display = 'block';
    });
});

document.getElementById('blogForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    var username = document.getElementById('username').value || 'undefined';
    var title = document.getElementById('title').value;
    var content = document.getElementById('content').value;
    var currentDate = new Date();
    var timeString = currentDate.toLocaleDateString() + ' at ' + currentDate.toLocaleTimeString();

    var post = {
        username: username,
        title: title,
        content: content,
        time: timeString
    };

    savePost(post);
    addPostToPage(post);

    document.getElementById('blogForm').reset();
    document.getElementById('blogForm').style.display = 'none';
});

function savePost(post) {
    fetch('/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Post saved:', data);
    })
    .catch(error => {
        console.error('Error saving post:', error);
    });
}

function loadPosts() {
    fetch('/api/posts')
    .then(response => response.json())
    .then(posts => {
        posts.forEach(post => {
            addPostToPage(post);
        });
    })
    .catch(error => {
        console.error('Error loading posts:', error);
    });
}

function addPostToPage(post) {
    var postContainer = document.createElement('div');
    postContainer.className = 'post';

    var postTitle = document.createElement('h2');
    postTitle.textContent = post.title;

    var postTime = document.createElement('p');
    postTime.className = 'time';
    postTime.textContent = 'Posted on ' + post.time;

    var postAuthor = document.createElement('p');
    postAuthor.className = 'author';
    postAuthor.textContent = 'Author: ' + post.username;

    var postContent = document.createElement('p');
    postContent.textContent = post.content;

    var commentButton = document.createElement('button');
    commentButton.textContent = 'Show Comments';
    commentButton.addEventListener('click', function() {
        loadComments(post.id);
        document.getElementById('commentForm').style.display = 'block';
        document.getElementById('postId').value = post.id;
    });

    postContainer.appendChild(postTitle);
    postContainer.appendChild(postTime);
    postContainer.appendChild(postAuthor);
    postContainer.appendChild(postContent);
    postContainer.appendChild(commentButton);

    document.getElementById('posts').appendChild(postContainer);
}

document.getElementById('commentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    var postId = document.getElementById('postId').value;
    var username = document.getElementById('commentUsername').value || 'undefined';
    var content = document.getElementById('commentContent').value;
    var currentDate = new Date();
    var timeString = currentDate.toLocaleDateString() + ' at ' + currentDate.toLocaleTimeString();

    var comment = {
        postId: postId,
        username: username,
        content: content,
        time: timeString
    };

    saveComment(comment);
    addCommentToPage(comment);

    document.getElementById('commentForm').reset();
});

function saveComment(comment) {
    fetch('/api/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(comment)    })
    .then(response => response.json())
    .then(data => {
        console.log('Comment saved:', data);
    })
    .catch(error => {
        console.error('Error saving comment:', error);
    });
}

function loadComments(postId) {
    fetch(`/api/comments/${postId}`)
    .then(response => response.json())
    .then(comments => {
        document.getElementById('comments').innerHTML = '';
        comments.forEach(comment => {
            addCommentToPage(comment);
        });
    })
    .catch(error => {
        console.error('Error loading comments:', error);
    });
}

function addCommentToPage(comment) {
    var commentContainer = document.createElement('div');
    commentContainer.className = 'comment';

    var commentUsername = document.createElement('p');
    commentUsername.className = 'username';
    commentUsername.textContent = 'Username: ' + comment.username;

    var commentTime = document.createElement('p');
    commentTime.className = 'time';
    commentTime.textContent = 'Posted on ' + comment.time;

    var commentContent = document.createElement('p');
    commentContent.className = 'content';
    commentContent.textContent = comment.content;

    commentContainer.appendChild(commentUsername);
    commentContainer.appendChild(commentTime);
    commentContainer.appendChild(commentContent);

    document.getElementById('comments').appendChild(commentContainer);
}
