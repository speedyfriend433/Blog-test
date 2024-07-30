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
        toggleComments(post.id, commentButton);
    });

    var commentSection = document.createElement('div');
    commentSection.className = 'comment-section';
    commentSection.style.display = 'none';

    var commentForm = document.createElement('form');
    commentForm.innerHTML = `
        <input type="hidden" name="postId" value="${post.id}">
        <input type="text" id="commentUsername-${post.id}" placeholder="Username" required>
        <textarea id="commentContent-${post.id}" placeholder="Comment" rows="3" required></textarea>
        <button type="submit">Add Comment</button>
    `;
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var username = document.getElementById(`commentUsername-${post.id}`).value || 'undefined';
        var content = document.getElementById(`commentContent-${post.id}`).value;
        var currentDate = new Date();
        var timeString = currentDate.toLocaleDateString() + ' at ' + currentDate.toLocaleTimeString();

        var comment = {
            postId: post.id,
            username: username,
            content: content,
            time: timeString
        };

        saveComment(comment);
        addCommentToPage(comment, commentSection);

        commentForm.reset();
    });

    var commentList = document.createElement('div');
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
    var commentSection = button.nextElementSibling;
    if (commentSection.style.display === 'none') {
        commentSection.style.display = 'block';
        button.textContent = 'Close Comments';
        loadComments(postId, commentSection.querySelector('.comment-list'));
    } else {
        commentSection.style.display = 'none';
        button.textContent = 'Show Comments';
    }
}

function saveComment(comment) {
    fetch('/api/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(comment)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Comment saved:', data);
    })
    .catch(error => {
        console.error('Error saving comment:', error);
    });
}

function loadComments(postId, commentList) {
    fetch(`/api/comments/${postId}`)
    .then(response => response.json())
    .then(comments => {
        commentList.innerHTML = ''; // Clear existing comments
        comments.forEach(comment => {
            addCommentToPage(comment, commentList);
        });
    })
    .catch(error => {
        console.error('Error loading comments:', error);
    });
}

function addCommentToPage(comment, commentList) {
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

    commentList.appendChild(commentContainer);
}
