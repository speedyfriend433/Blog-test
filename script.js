document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
});

document.getElementById('blogForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    var title = document.getElementById('title').value;
    var content = document.getElementById('content').value;
    var currentDate = new Date();
    var timeString = currentDate.toLocaleDateString() + ' at ' + currentDate.toLocaleTimeString();

    var post = {
        title: title,
        content: content,
        time: timeString
    };

    savePost(post);
    addPostToPage(post);

    document.getElementById('blogForm').reset();
});

function savePost(post) {
    var posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));
}

function loadPosts() {
    var posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.forEach(function(post) {
        addPostToPage(post);
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

    var postContent = document.createElement('p');
    postContent.textContent = post.content;

    postContainer.appendChild(postTitle);
    postContainer.appendChild(postTime);
    postContainer.appendChild(postContent);

    document.getElementById('posts').appendChild(postContainer);
}
