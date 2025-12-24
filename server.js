const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from client/build in production
app.use(express.static(path.join(__dirname, 'client/build')));

// Configure multer for S3 uploads
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    key: function (req, file, cb) {
      const fileName = `posts/${Date.now()}-${uuidv4()}-${file.originalname}`;
      cb(null, fileName);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// In-memory storage for posts (in production, use a database)
let posts = [
  {
    id: '1',
    username: 'demo_user',
    imageUrl: 'https://via.placeholder.com/400x400?text=Demo+Post',
    caption: 'Welcome to Instagram Mini! This is a demo post.',
    likes: 15,
    likedBy: [],
    timestamp: new Date().toISOString(),
    comments: [
      { id: '1', username: 'friend1', text: 'Great app!', timestamp: new Date().toISOString() }
    ]
  }
];

let users = [
  { id: '1', username: 'demo_user', email: 'demo@example.com' }
];

// Routes

// Get all posts
app.get('/api/posts', (req, res) => {
  const sortedPosts = posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json(sortedPosts);
});

// Create a new post
app.post('/api/posts', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { username, caption } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const newPost = {
      id: uuidv4(),
      username,
      imageUrl: req.file.location,
      caption: caption || '',
      likes: 0,
      likedBy: [],
      timestamp: new Date().toISOString(),
      comments: []
    };

    posts.unshift(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Like/unlike a post
app.post('/api/posts/:id/like', (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  const post = posts.find(p => p.id === id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const likedIndex = post.likedBy.indexOf(username);
  if (likedIndex > -1) {
    // Unlike
    post.likedBy.splice(likedIndex, 1);
    post.likes--;
  } else {
    // Like
    post.likedBy.push(username);
    post.likes++;
  }

  res.json(post);
});

// Add a comment to a post
app.post('/api/posts/:id/comments', (req, res) => {
  const { id } = req.params;
  const { username, text } = req.body;

  const post = posts.find(p => p.id === id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const newComment = {
    id: uuidv4(),
    username,
    text,
    timestamp: new Date().toISOString()
  };

  post.comments.push(newComment);
  res.status(201).json(newComment);
});

// Get user profile
app.get('/api/users/:username', (req, res) => {
  const { username } = req.params;
  const user = users.find(u => u.username === username);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const userPosts = posts.filter(p => p.username === username);
  
  res.json({
    ...user,
    posts: userPosts,
    postCount: userPosts.length
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Instagram Mini API is running' });
});

// Serve React app for all other routes (in production)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  res.status(500).json({ error: error.message || 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Instagram Mini server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
